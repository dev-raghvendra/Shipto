import { ProjectMemberInvitationRequestSchema } from "types/project"
import { CreateTeamRequestSchema, DeleteTeamMemberRequestSchema, DeleteTeamRequestSchema, GetTeamMemberRequestSchema, GetTeamRequestSchema, TeamMemberInvitationRequestSchema } from "types/team"
import { EmailPassLoginRequestSchema, SigninRequestSchema, GetUserRequestSchema, RefreshTokenRequestSchema } from "types/user"
import { AcceptMemberInviteRequestSchema, BodyLessRequestsSchema, HasPermissionsRequestSchema } from "types/utility"
import { ZodObject, ZodType,z } from "zod"

export type RPCs = 
    | "Login"
    | "Signin"
    | "OAuth"
    | "GetMe"
    | "GetUser"
    | "RefreshToken"
    | "CreateTeam"
    | "GetTeam"
    | "DeleteTeam"
    | "CreateTeamMemberInvitation"
    | "GetTeamMember"
    | "DeleteTeamMember"
    | "CreateProjectMemberInvitation"
    | "GetProjectMember"
    | "DeleteProjectMember"
    | "AcceptTeamInvitation"
    | "AcceptProjectInvitation"
    | "HasPermissions"

type RPC_SCHEMA_T = {
    [K in RPCs]: {
        schema: ZodType,
        errMsg: string
    }
}

function getERRMSG(schema: ZodObject<any>) {
    return `Request lacks any of them: (${schema.keyof().options.join(', ')})`
}

function createRPCEntry<T extends ZodType>(schema: T) {
    return {
        schema,
        errMsg: getERRMSG(schema as any)
    }
}

export const RPC_SCHEMA: RPC_SCHEMA_T = {
    Login: createRPCEntry(EmailPassLoginRequestSchema),
    Signin: createRPCEntry(SigninRequestSchema),
    OAuth: createRPCEntry(SigninRequestSchema),
    GetUser: createRPCEntry(GetUserRequestSchema),
    GetMe:createRPCEntry(BodyLessRequestsSchema),
    RefreshToken: createRPCEntry(RefreshTokenRequestSchema),
    CreateTeam: createRPCEntry(CreateTeamRequestSchema),
    GetTeam: createRPCEntry(GetTeamRequestSchema),
    DeleteTeam: createRPCEntry(DeleteTeamRequestSchema),
    CreateTeamMemberInvitation: createRPCEntry(TeamMemberInvitationRequestSchema),
    GetTeamMember: createRPCEntry(GetTeamMemberRequestSchema),
    DeleteTeamMember: createRPCEntry(DeleteTeamMemberRequestSchema),
    CreateProjectMemberInvitation: createRPCEntry(ProjectMemberInvitationRequestSchema),
    GetProjectMember: createRPCEntry(GetTeamMemberRequestSchema),
    DeleteProjectMember: createRPCEntry(DeleteTeamMemberRequestSchema),
    AcceptTeamInvitation:createRPCEntry(AcceptMemberInviteRequestSchema),
    AcceptProjectInvitation:createRPCEntry(AcceptMemberInviteRequestSchema),
    HasPermissions:createRPCEntry(HasPermissionsRequestSchema)
} as const
