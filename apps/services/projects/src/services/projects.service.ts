import { GrpcResponse } from "@shipto/services-commons/utils/rpc-utils";
import { Database, dbService } from "db/db-service";
import { CreateProjectRequestBodyType } from "types/projects";

class ProjectService {
    private _dbService: Database;
    private _ProjectServiceResponse: GrpcResponse;

    constructor() {
        this._ProjectServiceResponse = new GrpcResponse("PROJECT_SERVICE");
        this._dbService = dbService;
    }

    async createProject(body: CreateProjectRequestBodyType) {
        try {
           const fw = await this._dbService.findUniqueFrameworkById(body.frameworkId);
           body.framework=fw.displayName,
           body.projectType=fw.applicationType;
           const project = await this._dbService.createProject(body);
           return this._ProjectServiceResponse.OK(project, "Project created");
        } catch (error) {
            
        }
    }
}