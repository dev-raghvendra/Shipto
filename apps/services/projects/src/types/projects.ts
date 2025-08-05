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
    enviornmentVars:z.array(EnvVarsSchema).optional()
})

export type CreateProjectRequestBodyType = z.infer<typeof CreateProjectRequestSchema>;
export type CreateProjectRequestDBBodyType = Omit<CreateProjectRequestBodyType,"authUserData">


