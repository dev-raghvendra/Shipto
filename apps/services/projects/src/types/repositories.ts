import {z} from "zod";
import {UserSchema} from "@shipto/types";


export const GetRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const CreateRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    repositoryURI: z.url(),
    branch: z.string(),
    frameworkId: z.string(),
    buildCommand: z.string(),
    productionCommand: z.string().optional(),
}).strict();

export const UpdateRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    branch: z.string().optional(),
    frameworkId: z.string().optional(),
    buildCommand: z.string().optional(),
    productionCommand: z.string().optional(),
}).strict();

export const DeleteRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const UpsertEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    envVars: z.array(z.object({
        envName: z.string(),
        envValue: z.string(),
    })),
}).strict();

export const DeleteEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    envName: z.string(),
}).strict();

export const GetEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export type GetRepositoryRequestBodyType = z.infer<typeof GetRepositoryRequestSchema>;
export type GetRepositoryRequestDBBodyType = Omit<GetRepositoryRequestBodyType, "authUserData">;
export type CreateRepositoryRequestBodyType = z.infer<typeof CreateRepositoryRequestSchema>;
export type CreateRepositoryRequestDBBodyType = Omit<CreateRepositoryRequestBodyType, "authUserData">;
export type UpdateRepositoryRequestBodyType = z.infer<typeof UpdateRepositoryRequestSchema>;
export type UpdateRepositoryRequestDBBodyType = Omit<UpdateRepositoryRequestBodyType, "authUserData">;
export type DeleteRepositoryRequestBodyType = z.infer<typeof DeleteRepositoryRequestSchema>;
export type DeleteRepositoryRequestDBBodyType = Omit<DeleteRepositoryRequestBodyType, "authUserData">;
export type UpsertEnvVarsRequestBodyType = z.infer<typeof UpsertEnvVarsRequestSchema>;
export type UpsertEnvVarsRequestDBBodyType = Omit<UpsertEnvVarsRequestBodyType, "authUserData">;
export type DeleteEnvVarsRequestBodyType = z.infer<typeof DeleteEnvVarsRequestSchema>;
export type DeleteEnvVarsRequestDBBodyType = Omit<DeleteEnvVarsRequestBodyType, "authUserData">;
export type GetEnvVarsRequestBodyType = z.infer<typeof GetEnvVarsRequestSchema>;
export type GetEnvVarsRequestDBBodyType = Omit<GetEnvVarsRequestBodyType, "authUserData">;