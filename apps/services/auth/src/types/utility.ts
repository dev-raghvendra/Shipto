import { z } from 'zod';
import { PermissionType } from '@prisma/index';
import { UserSchema,Scopes } from './user';



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
export const HasPermissionsRequestSchema = z.object({
   resourceId : z.string(),
   scope : Scopes,
   permissions : z.array(z.enum(PermissionType)),
   authUserData:UserSchema,
   targetUserId:z.string().optional()
}).strict()

export type HasPermissionsRequestBodyType = z.infer<typeof HasPermissionsRequestSchema>

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
