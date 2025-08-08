import { UserSchema } from "@shipto/types";
import z from "zod";

export const GetDeploymentRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(5),
    deploymentId: z.string().min(5),
}).strict();

export const GetAllDeploymentsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(5),
    skip: z.number().int().nonnegative().optional().default(0),
    limit: z.number().int().nonnegative().optional().default(10),
}).strict();

export const DeleteDeploymentRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(5),
    deploymentId: z.string().min(5),
}).strict();

export const RedeployRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(5),
    deploymentId: z.string().min(5),
}).strict();

export const CreateDeploymentRequestSchema = z.object({
    payload: z.string().min(10),
    signature: z.string().min(10),
}).strict();

export const DeploymentDBSchema = z.object({
    projectId:z.string().min(5),
    commitHash:z.string().min(5),
    status:z.enum([ "QUEUED", "INACTIVE", "FAILED", "PRODUCTION", "BUILDING"]).default("QUEUED"),
    commitMessage:z.string().min(5),
    author:z.string().min(5),
    repositoryId:z.string().min(5),
}).strict();

export interface DeploymentWebhookPayload {
  after: string; 
  head_commit: {
    message: string; 
    author: {
      name: string; 
      email: string;
    };
  } | null;
  repository: {
    id: number;
  };
}



export type CreateDeploymentRequestBodyType = z.infer<typeof CreateDeploymentRequestSchema>;
export type CreateDeploymentRequestDBBodyType = z.infer<typeof DeploymentDBSchema> 
export type RedeployRequestBodyType = z.infer<typeof RedeployRequestSchema>;
export type RedeployRequestDBBodyType = Omit<RedeployRequestBodyType, "authUserData">;
export type DeleteDeploymentRequestBodyType = z.infer<typeof DeleteDeploymentRequestSchema>;
export type DeleteDeploymentRequestDBBodyType = Omit<DeleteDeploymentRequestBodyType, "authUserData">;
export type GetAllDeploymentsRequestBodyType = z.infer<typeof GetAllDeploymentsRequestSchema>;
export type GetAllDeploymentsRequestDBBodyType = Omit<GetAllDeploymentsRequestBodyType, "authUserData">;
export type GetDeploymentRequestBodyType = z.infer<typeof GetDeploymentRequestSchema>;
export type GetDeploymentRequestDBBodyType = Omit<GetDeploymentRequestBodyType, "authUserData">;