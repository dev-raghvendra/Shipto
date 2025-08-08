import {Prisma, PrismaClient} from "@prisma/client"
import { generateId, GrpcAppError } from "@shipto/services-commons";
import { CreateProjectRequestDBBodyType, UpdateProjectRequestDBBodyType } from "types/projects";
import {status} from "@grpc/grpc-js";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import { CreateDeploymentRequestDBBodyType } from "types/deployments";

const MODEL_MAP = {
    Project:"prj",
    Repository:"repo",
    Deployment:"dep",
    EnvironmentVariable:"env-var"
} as const;
export class Database {
    private _client : PrismaClient;
    constructor(){this._client = new PrismaClient}
     

    async createProject(body:CreateProjectRequestDBBodyType){
      try {
        const projectId = generateId("Project", MODEL_MAP);
        const res = await this._client.project.create({
        data: {
            projectId,
            name: body.name,
            domain:body.domain,
            frameworkId:body.frameworkId,
            projectType:body.projectType,
            branch:body.branch,
            productionCommand:body.productionCommand,
            buildCommand:body.buildCommand,
            repository:{
                create:{
                    repositoryId:generateId("Repository", MODEL_MAP),
                    githubRepoId:body.githubRepoId,
                    githubRepoName:body.githubRepoName,
                    githubRepoURI:body.githubRepoURI,
                    githubInstallationId:body.githubInstallationId
                }
            },
            environmentVariables:{
                create:body.environmentVars?.map(envVar=>({
                projectId,
                envName:envVar.envName,
                envValue:envVar.envValue
               }))
            }
        },
        include:{
            repository:true,
            framework:true,
            environmentVariables:true
        }
    })
      
      return res;
      } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) {
            if(error.code === "P2002") {
                throw new GrpcAppError(status.ALREADY_EXISTS, "Project with this domain already exists", {
                    domain:body.domain
                });
            }
        }
        throw new GrpcAppError(status.INTERNAL, "Failed to create project", {
            error
        });
      }
    }


    async finUniqueProjectById(projectId:string,select?:Prisma.ProjectSelect){
        const res = await this._client.project.findUnique({where:{projectId},select});
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Project not found", {
            projectId
        });
    }

    async findProjects(arg:Prisma.ProjectFindManyArgs){
        const res = await this._client.project.findMany(arg);
        if(res.length)return res;
        throw new GrpcAppError(status.NOT_FOUND, "User does not have any projects");
    }

    async updateProjectById({projectId,...data}:UpdateProjectRequestDBBodyType){
        try {
            const res = await this._client.project.update({
                where:{
                    projectId
                },
                data
            })
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Project not found", {
                        projectId
                    });
                }
                else if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Project with domain name already exists", {
                        domain: data.domain
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async deleteProjectById(projectId:string){
        try {
            const res = await this._client.project.delete({
                where: { projectId }
            });
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Project not found", {
                        projectId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async createDeployment(body:CreateDeploymentRequestDBBodyType){
        try {
            const deploymentId = generateId("Deployment", MODEL_MAP);
            const res = await this._client.deployment.create({
                data:{
                    deploymentId,
                    ...body
                }
            })
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Deployment with this commit hash already exists", {
                        commitHash: body.commitHash
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Failed to create deployment", {
                error: e
            });
        }
    }

    async findUniqueDeploymentById(deploymentId: string) {
        const res = await this._client.deployment.findUnique({
            where: { deploymentId },
            include:{
               repository:true,
               project:{
                select:{
                    domain:true,
                    branch:true,
                    name:true,
                }
               }
            }
        });
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Deployment not found", {
            deploymentId
        });
    }

    async findDeployments(args:Prisma.DeploymentFindManyArgs){
        const res = await this._client.deployment.findMany(args);
        if(res.length)return res;
        throw new GrpcAppError(status.NOT_FOUND, "No deployments found");
    }

    async deleteDeploymentById(deploymentId: string) {
        try {
            const res = await this._client.deployment.delete({
                where: { deploymentId }
            });
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Deployment not found", {
                        deploymentId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async findUniqueRepository(args:Prisma.RepositoryFindUniqueArgs){
        const res = await this._client.repository.findUnique(args);
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Repository not found", {
            args
        });
    }

    async findUniqueGithubInstallation(args:Prisma.GithubInstallationFindUniqueArgs){
        const res = await this._client.githubInstallation.findUnique(args);
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Github Installation not found", {
            args
        });
    }

    async findUniqueFrameworkById(frameworkId: string) {
        const res = await  this._client.framework.findUnique({
            where: { frameworkId }
        });
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Framework not found", {
            frameworkId
        });
    }
}

export const dbService = new Database();