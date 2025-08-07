import { createGrpcErrorHandler } from "@shipto/services-commons";
import { Database, dbService } from "db/db-service";
import authExternalService, { AuthExternalService } from "externals/auth.external.service";
import { GetDeploymentRequestBodyType } from "types/deployments";

export class DeploymentsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>

    constructor() {
        this._errHandler = createGrpcErrorHandler({serviceName:"DEPLOYMENT_SERVICE"});
        this._dbService = dbService;
        this._authService = authExternalService;
    }
    async getDeployment({authUserData, deploymentId,projectId}: GetDeploymentRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to read this deployment"
            });
            const deployment = await this._dbService.findUniqueDeploymentById(deploymentId);
            return { status: "OK", data: deployment, message: "Deployment found" };
        } catch (e:any) {
            
        }
    }
}