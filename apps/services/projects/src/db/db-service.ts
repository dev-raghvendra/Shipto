import {PrismaClient} from "@prisma/client"
import { generateId } from "@shipto/services-commons";
import { CreateProjectRequestDBBodyType } from "types/projects";

const MODEL_MAP = {
    Project:"prj",
    Repository:"repo",
    Framework:"fw",
    Deployment:"dep",
    EnvironmentVariable:"env-var"
} as const;
export class Database {
    private _client : PrismaClient;
    constructor(){this._client = new PrismaClient}
     

    createProject(body:CreateProjectRequestDBBodyType){
      return this._client.project.create({
        data: {
            projectId:generateId("Project",MODEL_MAP),
            name: body.name,
            framework:body.framework,
            projectType:body.projectType,
            repository:{
                connect:{
                    repositoryId:generateId("Repository",MODEL_MAP),
                    repoURI:body.repositoryURI,
                    branch:body.branch,
                    buildCommand:body.buildCommand,
                    productionCommand:body.productionCommand,
                    frameworkId:body.frameworkId
                }
            },
        }
      })
    }

    findUniqueFrameworkById(frameworkId: string) {
        return this._client.framework.findUniqueOrThrow({
            where: { frameworkId }
        });
    }
}

export const dbService = new Database();