import { status } from "@grpc/grpc-js";
import { createGrpcErrorHandler, GrpcResponse } from "@shipto/services-commons";
import { Database, dbService } from "db/db-service";
import authExternalService, { AuthExternalService } from "externals/auth.external.service";
import { verifySignature } from "libs/crypto";
import { CreateDeploymentRequestBodyType, CreateDeploymentRequestDBBodyType, DeleteDeploymentRequestBodyType, DeploymentWebhookPayload, GetAllDeploymentsRequestBodyType, GetDeploymentRequestBodyType, RedeployRequestBodyType } from "types/deployments";


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
            return GrpcResponse.OK(deployment, "Deployment found");
        } catch (e:any) {
            return this._errHandler(e, "GET-DEPLOYMENT");
        }
    }

    async getAllDeployments({authUserData, projectId, skip, limit}:GetAllDeploymentsRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to read deployments of this project"
            });
            const deployments = await this._dbService.findDeployments({
                where:{
                    projectId
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include:{
                    project:{
                      select:{
                      domain:true,
                      branch:true,
                      name:true,
                }
                },
                    repository:true
                }
            });
            return GrpcResponse.OK(deployments, "Deployments found");
        } catch (e:any) {
            return this._errHandler(e, "GET-ALL-DEPLOYMENTS");
        }
    }

    async deleteDeployment({authUserData, projectId, deploymentId}:DeleteDeploymentRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["DELETE"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to delete this deployment"
            });
            await this._dbService.deleteDeploymentById(deploymentId);
            return GrpcResponse.OK({}, "Deployment deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-DEPLOYMENT");
        }
    }

    async redeploy({authUserData, projectId, deploymentId}:RedeployRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["UPDATE"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to redeploy this deployment"
            });
            const deployment = await this._dbService.findUniqueDeploymentById(deploymentId);
            // Here we will add a message in the redis stream to trigger the redeployment
            // For now, we will just return the deployment as a placeholder
            return GrpcResponse.OK(deployment, "Deployment redeployed");
        } catch (e:any) {
            return this._errHandler(e, "REDEPLOY-DEPLOYMENT");
        }
    }

    async createDeployment({payload,signature}: CreateDeploymentRequestBodyType) {
       try {
          await verifySignature(payload, signature);
          const body = JSON.parse(payload) as DeploymentWebhookPayload;
          const repo = await this._dbService.findUniqueRepository({
            where:{
                githubRepoId:body.repository.id.toString()
            }
          })
          const deploymentData  : CreateDeploymentRequestDBBodyType = {
              projectId:repo.projectId,
              commitHash:body.after,
              status:"QUEUED",
              commitMessage:body.head_commit?.message || "no commit message",
              author:body.head_commit?.author.name || "unknown",
              repositoryId:repo.repositoryId
          }
          const deployment = await this._dbService.createDeployment(deploymentData);
          return GrpcResponse.OK(deployment, "Deployment created");
       } catch (e:any) {
           return this._errHandler(e, "CREATE-DEPLOYMENT");
       }
    }
}