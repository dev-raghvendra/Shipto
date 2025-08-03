import { z } from 'zod';
import { UserSchema } from './user';

export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK']);
export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;


export const AcceptMemberInviteRequestSchema = z.object({
  inviteId: z.string(),
  authUserData:UserSchema
});
export type AcceptMemberInviteRequestBodyType = z.infer<typeof AcceptMemberInviteRequestSchema>
export type AcceptMemberInviteRequestDBBodyType = Omit<z.infer<typeof AcceptMemberInviteRequestSchema>,"authUserData">
export const BodyLessRequestsSchema = z.object({
  authUserData:UserSchema
}).strict();
export type BodyLessRequests = z.infer<typeof BodyLessRequestsSchema>;

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;