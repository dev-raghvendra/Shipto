import z from "zod";
import {UserSchema} from "@shipto/types"

export const Projects = z.enum(["STATIC","DYNAMIC"])
export const EnvVarsSchema = z.object({
    envName:z.string(),
    envValue:z.string(),
})
export const CreateProjectRequestSchema = z.object({
    authUserData  : UserSchema,
    name:z.string(),
    framework : z.string().optional(),
    projectType : Projects ,
    frameworkId : z.string(),
    buildCommand:z.string(),
    productionCommand:z.string().optional(),
    branch:z.string(),
    repositoryURI:z.url(),
    domain:z.string(),
    githubInstallationId:z.string().optional(),
    githubRepositoryId:z.string().optional(),
    githubWebhookId:z.string().optional(),
    enviornmentVars:z.array(EnvVarsSchema).optional()
}).strict();

export const GetProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const GetAllUserProjectsRequestSchema = z.object({
    authUserData: UserSchema,
    skip: z.number().int().nonnegative().optional().default(0),
    limit: z.number().int().nonnegative().optional().default(10),
}).strict();

export const UpdateProjectRequestSchema = z.object({
    authUserData: UserSchema,
    name: z.string().optional(),
    domain: z.string().optional(),
    projectId: z.string(),
}).strict();

export const DeleteProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();



export type GetAllUserProjectRequestBodyType = z.infer<typeof GetAllUserProjectsRequestSchema>;
export type GetAllUserProjectRequestDBBodyType = Omit<GetAllUserProjectRequestBodyType, "authUserData">;
export type DeleteProjectRequestBodyType = z.infer<typeof DeleteProjectRequestSchema>;
export type DeleteProjectRequestDBBodyType = Omit<DeleteProjectRequestBodyType, "authUserData">;
export type UpdateProjectRequestBodyType = z.infer<typeof UpdateProjectRequestSchema>;
export type UpdateProjectRequestDBBodyType = Omit<UpdateProjectRequestBodyType, "authUserData">;
export type GetProjectRequestBodyType = z.infer<typeof GetProjectRequestSchema>;
export type GetProjectRequestDBBodyType = Omit<GetProjectRequestBodyType, "authUserData">;
export type CreateProjectRequestBodyType = z.infer<typeof CreateProjectRequestSchema>;
export type CreateProjectRequestDBBodyType = Omit<CreateProjectRequestBodyType,"authUserData">


