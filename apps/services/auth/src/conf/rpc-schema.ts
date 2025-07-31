import { 
    CreateTeamRequestSchema, 
    DeleteProjectRequestSchema, 
    DeleteTeamMemberRequestSchema, 
    DeleteTeamRequestSchema, 
    EmailPassLoginSchema, 
    GetTeamMemberRequestSchema, 
    GetTeamRequestSchema, 
    GetUserRequestSchema, 
    ProjectMemberInvitationSchema, 
    RefreshTokenRequestSchema, 
    SigninRequestSchema, 
    TeamMemberInvitationSchema, 
    UserSchema 
} from "types"
import { ZodObject, ZodType } from "zod"

export type RPCs = 
    | "Login"
    | "Signin"
    | "OAuth"
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
    | "DeleteProject"


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
    Login: createRPCEntry(EmailPassLoginSchema),
    Signin: createRPCEntry(SigninRequestSchema),
    OAuth: createRPCEntry(SigninRequestSchema),
    GetUser: createRPCEntry(GetUserRequestSchema),
    RefreshToken: createRPCEntry(RefreshTokenRequestSchema),
    CreateTeam: createRPCEntry(CreateTeamRequestSchema),
    GetTeam: createRPCEntry(GetTeamRequestSchema),
    DeleteTeam: createRPCEntry(DeleteTeamRequestSchema),
    CreateTeamMemberInvitation: createRPCEntry(TeamMemberInvitationSchema),
    GetTeamMember: createRPCEntry(GetTeamMemberRequestSchema),
    DeleteTeamMember: createRPCEntry(DeleteTeamMemberRequestSchema),
    CreateProjectMemberInvitation: createRPCEntry(ProjectMemberInvitationSchema),
    GetProjectMember: createRPCEntry(GetTeamMemberRequestSchema),
    DeleteProjectMember: createRPCEntry(DeleteTeamMemberRequestSchema),
    DeleteProject: createRPCEntry(DeleteProjectRequestSchema)
} as const
