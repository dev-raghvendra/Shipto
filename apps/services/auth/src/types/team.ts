import { RolesGeneric } from "types/utility";
import z from "zod";
import { UserBody } from "./user";

export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable()
}).strict();
export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;


export const TeamMemberInvitationRoles = RolesGeneric.exclude(['OWNER']);
export type TeamMemberInvitationRolesType = z.infer<typeof TeamMemberInvitationRoles>;

export const TeamMemberInvitationRequestSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: TeamMemberInvitationRoles
}).strict();
export type TeamMemberInvitationRequestBodyType = z.infer<typeof TeamMemberInvitationRequestSchema> & { authUserData: UserBody };
export type TeamMemberInvitationRequestDBBodyType = z.infer<typeof TeamMemberInvitationRequestSchema>;

export const CreateTeamRequestSchema = z.object({
  teamName: z.string(),
  description: z.string(),
}).strict();
export type CreateTeamRequestBodyType = z.infer<typeof CreateTeamRequestSchema> & { authUserData: UserBody };
export type CreateTeamRequestDBBodyType = z.infer<typeof CreateTeamRequestSchema>;

export const GetTeamRequestSchema = z.object({
  teamId: z.string(),
}).strict();
export type GetTeamRequestBodyType = z.infer<typeof GetTeamRequestSchema> & { authUserData: UserBody };
export type GetTeamRequestDBBodyType = z.infer<typeof GetTeamRequestSchema>;

export const DeleteTeamRequestSchema = z.object({
  teamId: z.string(),
}).strict();
export type DeleteTeamRequestBodyType = z.infer<typeof DeleteTeamRequestSchema> & { authUserData: UserBody };
export type DeleteTeamRequestDBBodyType = z.infer<typeof DeleteTeamRequestSchema>

export const GetTeamMemberRequestSchema = z.object({
  memberId: z.string(),
}).strict();
export type GetTeamMemberRequestBodyType = z.infer<typeof GetTeamMemberRequestSchema> & { authUserData: UserBody };
export type GetTeamMemberRequestDBBodyType = z.infer<typeof GetTeamMemberRequestSchema> 

export const DeleteTeamMemberRequestSchema = z.object({
  memberId: z.string(),
}).strict();
export type DeleteTeamMemberRequestBodyType = z.infer<typeof DeleteTeamMemberRequestSchema> & { authUserData: UserBody };
export type DeleteTeamMemberRequestDBBodyType = z.infer<typeof DeleteTeamMemberRequestSchema>