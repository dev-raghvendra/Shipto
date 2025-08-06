import { UserSchema } from "@shipto/types";
import z from "zod";

export const GetDeploymentRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    deploymentId: z.string(),
}).strict();

export const GetAllDeploymentsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    skip: z.number().int().nonnegative().optional().default(0),
    limit: z.number().int().nonnegative().optional().default(10),
}).strict();

export const DeleteDeploymentRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    deploymentId: z.string(),
}).strict();

export const RedeployRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    deploymentId: z.string(),
}).strict();


export type RedeployRequestBodyType = z.infer<typeof RedeployRequestSchema>;
export type RedeployRequestDBBodyType = Omit<RedeployRequestBodyType, "authUserData">;
export type DeleteDeploymentRequestBodyType = z.infer<typeof DeleteDeploymentRequestSchema>;
export type DeleteDeploymentRequestDBBodyType = Omit<DeleteDeploymentRequestBodyType, "authUserData">;
export type GetAllDeploymentsRequestBodyType = z.infer<typeof GetAllDeploymentsRequestSchema>;
export type GetAllDeploymentsRequestDBBodyType = Omit<GetAllDeploymentsRequestBodyType, "authUserData">;
export type GetDeploymentRequestBodyType = z.infer<typeof GetDeploymentRequestSchema>;
export type GetDeploymentRequestDBBodyType = Omit<GetDeploymentRequestBodyType, "authUserData">;