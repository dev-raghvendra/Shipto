import { ProjectMemberInvitationRequestSchema } from "types/project"
import { CreateTeamRequestSchema, DeleteTeamMemberRequestSchema, DeleteTeamRequestSchema, GetTeamMemberRequestSchema, GetTeamRequestSchema, TeamMemberInvitationRequestSchema } from "types/team"
import { EmailPassLoginRequestSchema, SigninRequestSchema, GetUserRequestSchema, OAuthRequestSchema } from "types/user"
import { AcceptMemberInviteRequestSchema, HasPermissionsRequestSchema } from "types/utility"
import { createRPCEntry, RPC_SCHEMA_T } from "@shipto/services-commons";
import { BodyLessRequestSchema } from "@shipto/types";

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
    | "GetAllUserProjectIds"
    | "GetAllUserTeams"



export const RPC_SCHEMA: RPC_SCHEMA_T<RPCs> = {
    Login: createRPCEntry(EmailPassLoginRequestSchema),
    Signin: createRPCEntry(SigninRequestSchema),
    OAuth: createRPCEntry(OAuthRequestSchema),
    GetUser: createRPCEntry(GetUserRequestSchema),
    GetMe:createRPCEntry(BodyLessRequestSchema),
    RefreshToken: createRPCEntry(BodyLessRequestSchema),
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
    HasPermissions:createRPCEntry(HasPermissionsRequestSchema),
    GetAllUserProjectIds:createRPCEntry(BodyLessRequestSchema),
    GetAllUserTeams:createRPCEntry(BodyLessRequestSchema)
} as const
