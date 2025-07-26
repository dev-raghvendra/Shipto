import { z } from 'zod';

export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export const ProjectMemberInvitationRoles = z.enum(['OWNER', 'ADMIN', 'DEVELOPER', 'VIEWER']);
export const Scopes = z.enum(['PROJECT','DEPLOYMENT','TEAM','TEAM_MEMBER','PROJECT_MEMBER','TEAM_LINK']);
export const TeamMemberInvitationRoles = ProjectMemberInvitationRoles.exclude(['OWNER']);

export const UserSchema = z.object({
    fullName: z.string(),
    email: z.email(),
    password: z.string(),
    avatarUri: z.url(),
    provider: Providers,
}).strict()

export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable(),
  planType: z.string().default("free")
}).strict()

export const TeamMemberInvitationSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: TeamMemberInvitationRoles
}).strict()

export const ProjectMemberInvitationSchema = z.object({
  userId: z.string(),
  role: ProjectMemberInvitationRoles,
  projectId: z.string(),
}).strict()

export const EmailPassLoginSchema = z.object({
    email:z.email(),
    password:z.string()
}).strict()


export type UserBody = z.infer<typeof UserSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;
export type TeamMemberInvitationBody = z.infer<typeof TeamMemberInvitationSchema>;
export type ProjectMemberInvitationBody = z.infer<typeof ProjectMemberInvitationSchema>;
export type EmailPassLoginBody = z.infer<typeof EmailPassLoginSchema>
export type ScopeType = z.infer<typeof Scopes>
export type RoleType = z.infer<typeof ProjectMemberInvitationRoles>