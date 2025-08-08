import { status } from "@grpc/grpc-js";
import { Prisma } from "@prisma/index";
import { createGrpcErrorHandler, GrpcAppError } from "@shipto/services-commons";
import { GrpcResponse } from "@shipto/services-commons/utils/rpc-utils";
import { BodyLessRequestBodyType } from "@shipto/types";
import { Database, dbService } from "db/db-service";
import authExternalService, { AuthExternalService } from "externals/auth.external.service";
import githubExternalService, { GithubExternalService } from "externals/github.external.service";
import { CreateProjectRequestBodyType, CreateProjectRequestDBBodyType, GetProjectRequestBodyType, UpdateProjectRequestBodyType } from "types/projects";

export class ProjectsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _githubService: GithubExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    private _selectProjectFeilds:Prisma.ProjectSelect

    constructor() {
        this._errHandler = createGrpcErrorHandler({serviceName:"PROJECT_SERVICE"});
        this._selectProjectFeilds = {
                repository:true,
                name:true,
                domain:true,
                projectType:true,
                framework:{
                    select:{
                        frameworkId:true,
                        displayName:true,
                        icon:true
                    }
                },
                branch:true,
                buildCommand:true,
                productionCommand:true,
                projectId:true,
                environmentVariables:{
                    select:{
                        envName:true,
                        envValue:true
                    }
                },
                createdAt:true,
                updatedAt:true
            }
        this._dbService = dbService;
        this._authService = authExternalService;
        this._githubService = githubExternalService
    }

    async createProject(body: CreateProjectRequestBodyType) {
        try {
           const fw = await this._dbService.findUniqueFrameworkById(body.frameworkId);
           body.projectType=fw.applicationType;
           const githubInstallation = await this._dbService.findUniqueGithubInstallation({
            where:{
                userId:body.authUserData.userId
            }
           });
           const githubRepo = await this._githubService.getRepositoryDetails(githubInstallation.githubInstallationId,
            body.githubRepoId
           );
           const projectData : CreateProjectRequestDBBodyType = {
            ...body,
            githubRepoURI:githubRepo.html_url,
            githubRepoName:githubRepo.name,
            githubRepoId:githubRepo.id.toString(),
            githubInstallationId:githubInstallation.githubInstallationId
           }
           const project = await this._dbService.createProject(projectData);
           return GrpcResponse.OK(project, "Project created");
        } catch (e:any) {
            return this._errHandler(e, "CREATE-PROJECT");
        }
    }

    async getProject({authUserData,projectId}:GetProjectRequestBodyType){
        try {
            await this._authService.getPermissions({authUserData,permissions:["READ"],scope:"PROJECT",resourceId:projectId,errMsg:"You do not have permission to read this project"});
            const project = await this._dbService.finUniqueProjectById(projectId,this._selectProjectFeilds);
            return GrpcResponse.OK(project, "Project found");
        } catch (e:any) {
            return this._errHandler(e,"GET-PROJECT");
        }
    }

    async getAllUserProjects({authUserData}:BodyLessRequestBodyType){
        try {
            const projectIds = await this._authService.getUserProjectIds(authUserData);
            if(!projectIds.length) throw new GrpcAppError(status.NOT_FOUND, "User does not have any projects");
            const projects = await this._dbService.findProjects({where:{
                projectId:{in:projectIds}
            },
            select:this._selectProjectFeilds})
            return GrpcResponse.OK(projects, "Projects found");
        } catch (e:any) {
            return this._errHandler(e,"GET-ALL-USER-PROJECTS");
        }
    }

    async updateProject({authUserData,...body}:UpdateProjectRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to update this project",
                permissions:["UPDATE"]
            });
            if(body.updates.frameworkId){
                const fw = await this._dbService.findUniqueFrameworkById(body.updates.frameworkId);
                if(!fw.defaultProdCmd){
                    delete body.updates.productionCommand;
                }
                body.updates = {...body.updates, projectType:fw.applicationType}
            }
            const project = await this._dbService.updateProjectById(body as any);
            return GrpcResponse.OK(project, "Project updated");
        } catch (e:any) {
            return this._errHandler(e, "UPDATE-PROJECT");
        }
    }

    async deleteProject({authUserData,projectId}:GetProjectRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:projectId,
                errMsg:"You do not have permission to delete this project",
                permissions:["DELETE"]
            });
            const project = await this._dbService.deleteProjectById(projectId);
            return GrpcResponse.OK(project, "Project deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-PROJECT");
        }
    }
}

//TODO:
//hooks
// installation/repositories
// installation/repository
// installation/deleted
// installation/repo/push
// installation/repo/deleted

//rpcs
//callback/installation
// unlink repo
// link repo
// get user repositories