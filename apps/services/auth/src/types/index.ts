import { z } from 'zod';

export const ProviderType = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export const ProjectMemberInvitationRoleType = z.enum(['OWNER', 'ADMIN', 'DEVELOPER', 'VIEWER']);
export const TeamMemberInvitationRoleType = ProjectMemberInvitationRoleType.exclude(['OWNER']);

export const UserSchema = z.object({
    fullName: z.string(),
    email: z.email(),
    password: z.string(),
    avatarUri: z.url(),
    provider: ProviderType,
}).strict()

export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable(),
  planType: z.string().default("free").optional()
}).strict()

export const TeamMemberInvitationSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: TeamMemberInvitationRoleType
}).strict()

export const ProjectMemberInvitationSchema = z.object({
  userId: z.string(),
  role: ProjectMemberInvitationRoleType,
  projectId: z.string(),
}).strict()

export const EmailPassLoginSchema = z.object({
    email:z.email(),
    password:z.string()
}).strict()

// Inferred Types
export type UserBody = z.infer<typeof UserSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;
export type TeamMemberInvitationBody = z.infer<typeof TeamMemberInvitationSchema>;
export type ProjectMemberInvitationBody = z.infer<typeof ProjectMemberInvitationSchema>;
export type EmailPassLoginBody = z.infer<typeof EmailPassLoginSchema>