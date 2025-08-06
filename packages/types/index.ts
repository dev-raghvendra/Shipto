import {z} from "zod"

export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK']);
export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;

export const UserSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  userId: z.string(),
  avatarUri: z.url(),
  createdAt: z.string(),
  emailVerified:z.boolean(),
  updatedAt: z.string(),
  provider:Providers
}).strict();

export const BodyLessRequestSchema = z.object({
  authUserData:UserSchema
}).strict();
export type BodyLessRequestBodyType = z.infer<typeof BodyLessRequestSchema>;