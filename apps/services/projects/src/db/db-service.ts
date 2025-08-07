import {Prisma, PrismaClient} from "@prisma/client"
import { generateId, GrpcAppError } from "@shipto/services-commons";
import { CreateProjectRequestDBBodyType, UpdateProjectRequestDBBodyType } from "types/projects";
import {status} from "@grpc/grpc-js";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";

const MODEL_MAP = {
    Project:"prj",
    Repository:"repo",
    Framework:"res",
    Deployment:"dep",
    EnvironmentVariable:"env-var"
} as const;
export class Database {
    private _client : PrismaClient;
    constructor(){this._client = new PrismaClient}
     

    async createProject(body:CreateProjectRequestDBBodyType){
      try {
        const projectId = generateId("Project", MODEL_MAP);
        const repo = await
        const res = await this._client.project.create({
        data: {
            projectId,
            name: body.name,
            framework:body.framework,
            projectType:body.projectType,
            domain:body.domain,
            repository:{
                create:{
                    repositoryId:generateId("Repository",MODEL_MAP),
                    repoURI:body.repositoryURI,
                    branch:body.branch,
                    buildCommand:body.buildCommand,
                    productionCommand:body.productionCommand,
                    frameworkId:body.frameworkId,
                }
            },
            environmentVariables:{
                create: body.enviornmentVars?.map(env=>{
                    return {
                        projectId,
                        envName:env.envName,
                        envValue:env.envValue
                    }
                })
            }
        },
        include:{
            repository: true,
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

    async findUniqueFrameworkById(frameworkId: string) {
        const res = await  this._client.framework.findUnique({
            where: { frameworkId }
        });
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Framework not found", {
            frameworkId
        });
    }

    async finUniqueProjectById(projectId:string){
        const res = await this._client.project.findUnique({where:{projectId}});
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

    async findUniqueDeploymentById(deploymentId: string) {
        const res = await this._client.deployment.findUnique({
            where: { deploymentId },
            include:{
               repository:{
                 select:{
                    repoURI:true,
                    repoName:true,
                    branch:true
                 }
               },
               project:{
                select:{
                    domain:true,
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
}

export const dbService = new Database();