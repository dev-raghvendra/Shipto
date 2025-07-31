import { z } from 'zod';

export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export type ProvidersType = z.infer<typeof Providers>;

export const ProjectMemberInvitationRoles = z.enum(['OWNER', 'ADMIN', 'DEVELOPER', 'VIEWER']);
export type ProjectMemberInvitationRolesType = z.infer<typeof ProjectMemberInvitationRoles>;

export const Scopes = z.enum(['PROJECT','DEPLOYMENT','TEAM','TEAM_MEMBER','PROJECT_MEMBER','TEAM_LINK']);
export type ScopesType = z.infer<typeof Scopes>;

export const TeamMemberInvitationRoles = ProjectMemberInvitationRoles.exclude(['OWNER']);
export type TeamMemberInvitationRolesType = z.infer<typeof TeamMemberInvitationRoles>;

export const UserSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  userId: z.string(),
  avatarUri: z.url(),
  createdAt: z.string(),
  updatedAt: z.string(),
  provider: Providers,
}).strict();
export type UserSchemaType = z.infer<typeof UserSchema>;

export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable()
}).strict();
export type TeamSchemaType = z.infer<typeof TeamSchema>;

export const TeamMemberInvitationSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: TeamMemberInvitationRoles
}).strict();
export type TeamMemberInvitationSchemaType = z.infer<typeof TeamMemberInvitationSchema> & {
  authUserData:UserBody};

export const ProjectMemberInvitationSchema = z.object({
  userId: z.string(),
  role: ProjectMemberInvitationRoles,
  projectId: z.string(),
}).strict();
export type ProjectMemberInvitationSchemaType = z.infer<typeof ProjectMemberInvitationSchema>;

export const TokensSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
}).strict();
export type TokensSchemaType = z.infer<typeof TokensSchema>;

export const EmailPassLoginSchema = z.object({
  email: z.email(),
  password: z.string()
}).strict();
export type EmailPassLoginSchemaType = z.infer<typeof EmailPassLoginSchema>;

export const SigninRequestSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
  avatarUri: z.string(),
  provider: Providers,
}).strict();
export type SigninRequestSchemaType = z.infer<typeof SigninRequestSchema> & { authUserData: UserBody };

export const GetUserRequestSchema = z.object({
  targetUserId: z.string(),
}).strict();
export type GetUserRequestSchemaType = z.infer<typeof GetUserRequestSchema> & { authUserData: UserBody };

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
}).strict();
export type RefreshTokenRequestSchemaType = z.infer<typeof RefreshTokenRequestSchema> & { authUserData: UserBody };

export const CreateTeamRequestSchema = z.object({
  teamName: z.string(),
  description: z.string(),
}).strict();
export type CreateTeamRequestSchemaType = z.infer<typeof CreateTeamRequestSchema> & { authUserData: UserBody };

export const GetTeamRequestSchema = z.object({
  teamId: z.string(),
}).strict();
export type GetTeamRequestSchemaType = z.infer<typeof GetTeamRequestSchema> & { authUserData: UserBody };

export const DeleteTeamRequestSchema = z.object({
  teamId: z.string(),
}).strict();
export type DeleteTeamRequestSchemaType = z.infer<typeof DeleteTeamRequestSchema> & { authUserData: UserBody };

export const GetTeamMemberRequestSchema = z.object({
  memberId: z.string(),
}).strict();
export type GetTeamMemberRequestSchemaType = z.infer<typeof GetTeamMemberRequestSchema> & { authUserData: UserBody };

export const DeleteTeamMemberRequestSchema = z.object({
  memberId: z.string(),
}).strict();
export type DeleteTeamMemberRequestSchemaType = z.infer<typeof DeleteTeamMemberRequestSchema> & { authUserData: UserBody };

export const DeleteProjectRequestSchema = z.object({
  projectId: z.string(),
}).strict();
export type DeleteProjectRequestSchemaType = z.infer<typeof DeleteProjectRequestSchema> & { authUserData: UserBody };

// Existing types for convenience
export type UserBody = z.infer<typeof UserSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;
export type TeamMemberInvitationBody = z.infer<typeof TeamMemberInvitationSchema>;
export type ProjectMemberInvitationBody = z.infer<typeof ProjectMemberInvitationSchema>;
export type EmailPassLoginBody = z.infer<typeof EmailPassLoginSchema>;
export type ScopeType = z.infer<typeof Scopes>;
export type RoleType = z.infer<typeof ProjectMemberInvitationRoles>;
