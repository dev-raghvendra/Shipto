import { createRPCEntry, RPC_SCHEMA_T } from "@shipto/services-commons";
import { DeleteDeploymentRequestSchema, GetAllDeploymentsRequestSchema, GetDeploymentRequestSchema, RedeployRequestSchema } from "types/deployments";
import { CreateProjectRequestSchema, DeleteProjectRequestSchema, GetAllUserProjectsRequestSchema, GetProjectRequestSchema, UpdateProjectRequestSchema } from "types/projects";
import { CreateRepositoryRequestSchema, DeleteEnvVarsRequestSchema, DeleteRepositoryRequestSchema, GetEnvVarsRequestSchema, GetRepositoryRequestSchema, UpdateRepositoryRequestSchema, UpsertEnvVarsRequestSchema } from "types/repositories";

import { BodyLessRequestSchema } from "@shipto/types";

export type RPCs = 
    | "CreateProject"
    | "GetProject"
    | "GetAllUserProjects"
    | "UpdateProject"
    | "DeleteProject"
    | "GetDeployment"
    | "GetAllDeployments"
    | "DeleteDeployment"
    | "Redeploy"
    | "UpsertEnvVars"
    | "DeleteEnvVars"
    | "GetEnvVars"
    | "GetRepository"
    | "CreateRepository"
    | "UpdateRepository"
    | "DeleteRepository"
    | "GetFrameworks";
  
export const RPC_SCHEMA: RPC_SCHEMA_T<RPCs> = {
    CreateProject: createRPCEntry(CreateProjectRequestSchema),
    GetProject: createRPCEntry(GetProjectRequestSchema),
    GetAllUserProjects: createRPCEntry(GetAllUserProjectsRequestSchema),
    UpdateProject: createRPCEntry(UpdateProjectRequestSchema),
    DeleteProject: createRPCEntry(DeleteProjectRequestSchema),
    GetDeployment: createRPCEntry(GetDeploymentRequestSchema),
    GetAllDeployments: createRPCEntry(GetAllDeploymentsRequestSchema),
    DeleteDeployment: createRPCEntry(DeleteDeploymentRequestSchema),
    Redeploy: createRPCEntry(RedeployRequestSchema),
    UpsertEnvVars: createRPCEntry(UpsertEnvVarsRequestSchema),
    DeleteEnvVars: createRPCEntry(DeleteEnvVarsRequestSchema),
    GetEnvVars: createRPCEntry(GetEnvVarsRequestSchema),
    GetRepository: createRPCEntry(GetRepositoryRequestSchema),
    CreateRepository: createRPCEntry(CreateRepositoryRequestSchema),
    UpdateRepository: createRPCEntry(UpdateRepositoryRequestSchema),
    DeleteRepository: createRPCEntry(DeleteRepositoryRequestSchema),
    GetFrameworks: createRPCEntry(BodyLessRequestSchema)
} as const;