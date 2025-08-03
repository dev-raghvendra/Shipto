import z from "zod";

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
export const SigninRequestSchema = z.object({
  fullName: z.string().min(4,"fullName must be 4 chars long"),
  email: z.email(),
  password: z.string().min(8,"Password must be atleast 8 chars long"),
  avatarUri: z.url(),
  provider: Providers,
}).strict();
export const EmailPassLoginRequestSchema = z.object({
    email: z.email(),
    password: z.string()
}).strict();


export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserBody = z.infer<typeof UserSchema>;
export type EmailPassLoginRequestBodyType = z.infer<typeof EmailPassLoginRequestSchema>;
export type SigninRequestBodyType = z.infer<typeof SigninRequestSchema>

export const GetUserRequestSchema = z.object({
  targetUserId: z.string(),
  authUserData:UserSchema
}).strict();

export type GetUserRequestBodyType = z.infer<typeof GetUserRequestSchema>;
export type GetUserRequestDBBodyType = Omit<z.infer<typeof GetUserRequestSchema>,"authUserData">

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
  authUserData:UserSchema
}).strict();

export type RefreshTokenRequestBodyType = z.infer<typeof RefreshTokenRequestSchema>

export const TokensSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
}).strict();
export type TokensBodyType = z.infer<typeof TokensSchema>;

