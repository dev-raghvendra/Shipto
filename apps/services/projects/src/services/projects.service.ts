import { status } from "@grpc/grpc-js";
import { createGrpcErrorHandler, GrpcAppError } from "@shipto/services-commons";
import { GrpcResponse } from "@shipto/services-commons/utils/rpc-utils";
import { BodyLessRequestBodyType } from "@shipto/types";
import { Database, dbService } from "db/db-service";
import authExternalService, { AuthExternalService } from "externals/auth.external.service";
import { CreateProjectRequestBodyType, GetProjectRequestBodyType, UpdateProjectRequestBodyType } from "types/projects";

export class ProjectsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>

    constructor() {
        this._errHandler = createGrpcErrorHandler({serviceName:"PROJECT_SERVICE"});
        this._dbService = dbService;
        this._authService = authExternalService;
    }

    async createProject(body: CreateProjectRequestBodyType) {
        try {
           const fw = await this._dbService.findUniqueFrameworkById(body.frameworkId);
           body.framework=fw.displayName,
           body.projectType=fw.applicationType;
           const project = await this._dbService.createProject(body);
           return GrpcResponse.OK(project, "Project created");
        } catch (e:any) {
            return this._errHandler(e, "CREATE-PROJECT");
        }
    }

    async getProject({authUserData,projectId}:GetProjectRequestBodyType){
        try {
            await this._authService.getPermissions({authUserData,permissions:["READ"],scope:"PROJECT",resourceId:projectId,errMsg:"You do not have permission to read this project"});
            const project = await this._dbService.finUniqueProjectById(projectId);
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
            }})
            return GrpcResponse.OK(projects, "Projects found");
        } catch (e:any) {
            return this._errHandler(e,"GET-ALL-USER-PROJECTS");
        }
    }

    async updateProject({authUserData,projectId,name}:UpdateProjectRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:projectId,
                errMsg:"You do not have permission to update this project",
                permissions:["UPDATE"]
            })
            const project = await this._dbService.updateProjectById({projectId,name})
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