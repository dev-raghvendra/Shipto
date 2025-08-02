import { z } from 'zod';
import { UserBody } from './user';

export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK']);
export const RolesGeneric = z.enum(['OWNER', 'ADMIN', 'DEVELOPER', 'VIEWER'])
export type RoleTypeGenericType = z.infer<typeof RolesGeneric>;
export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;


export const AcceptMemberInviteRequestSchema = z.object({
  inviteId: z.string()
});
export type AcceptMemberInviteRequestBodyType = z.infer<typeof AcceptMemberInviteRequestSchema> & {authUserData:UserBody}
export type AcceptMemberInviteRequestDBBodyType = z.infer<typeof AcceptMemberInviteRequestSchema>

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;