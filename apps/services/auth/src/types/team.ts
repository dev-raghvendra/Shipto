import z from "zod";
import { UserBody, UserSchema } from "./user";

export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable(),
}).strict();
export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;


export const TeamRoles = z.enum(['TEAM_DEVELOPER','TEAM_ADMIN', 'TEAM_OWNER', 'TEAM_VIEWER', 'TEAM_DEVELOPER'])
export type TeamRoleType = z.infer<typeof TeamRoles>;

export const TeamMemberInvitationRequestSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: TeamRoles,
  authUserData:UserSchema
}).strict();
export type TeamMemberInvitationRequestBodyType = z.infer<typeof TeamMemberInvitationRequestSchema>
export type TeamMemberInvitationRequestDBBodyType = Omit<TeamMemberInvitationRequestBodyType,"authUserData">

export const CreateTeamRequestSchema = z.object({
  teamName: z.string(),
  description: z.string(),
  authUserData:UserSchema
}).strict();
export type CreateTeamRequestBodyType = z.infer<typeof CreateTeamRequestSchema>;
export type CreateTeamRequestDBBodyType = Omit<CreateTeamRequestBodyType,"authUserData">

export const GetTeamRequestSchema = z.object({
  teamId: z.string(),
  authUserData:UserSchema
}).strict();
export type GetTeamRequestBodyType = z.infer<typeof GetTeamRequestSchema>
export type GetTeamRequestDBBodyType = Omit<GetTeamRequestBodyType,"authUserData">

export const DeleteTeamRequestSchema = z.object({
  teamId: z.string(),
  authUserData:UserSchema
}).strict();
export type DeleteTeamRequestBodyType = z.infer<typeof DeleteTeamRequestSchema>
export type DeleteTeamRequestDBBodyType = Omit<DeleteTeamRequestBodyType,"authUserData">

export const GetTeamMemberRequestSchema = z.object({
  targetUserId: z.string(),
  teamId:z.string(),
  authUserData:UserSchema
}).strict();
export type GetTeamMemberRequestBodyType = z.infer<typeof GetTeamMemberRequestSchema>
export type GetTeamMemberRequestDBBodyType =  Omit<GetTeamMemberRequestBodyType,"authUserData"> 

export const DeleteTeamMemberRequestSchema = z.object({
  targetUserId: z.string(),
  teamId:z.string(),
  authUserData:UserSchema
}).strict();
export type DeleteTeamMemberRequestBodyType = z.infer<typeof DeleteTeamMemberRequestSchema>
export type DeleteTeamMemberRequestDBBodyType = Omit<DeleteTeamMemberRequestBodyType,"authUserData"> 