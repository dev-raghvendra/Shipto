import { UserSchema } from "@shipto/types";
import z from "zod";

export const ProjectRoles = z.enum(['PROJECT_OWNER', 'PROJECT_ADMIN', 'PROJECT_VIEWER','PROJECT_DEVELOPER'])
export type ProjectRoleType = z.infer<typeof ProjectRoles>;

export const ProjectMemberInvitationRequestSchema = z.object({
  userId: z.string(),
  role: ProjectRoles,
  projectId: z.string(),
  authUserData:UserSchema
}).strict();
export type ProjectMemberInvitationRequestBodyType = z.infer<typeof ProjectMemberInvitationRequestSchema>
export type ProjectMemberInvitationRequestDBBodyType = Omit<ProjectMemberInvitationRequestBodyType,"authUserData">

export const GetProjectMemberRequestSchema = z.object({
  targetUserId: z.string(),
  projectId:z.string(),
  authUserData:UserSchema
}).strict();
export type GetProjectMemberRequestBodyType = z.infer<typeof GetProjectMemberRequestSchema>
export type GetProjectMemberRequestDBBodyType =  Omit<GetProjectMemberRequestBodyType,"authUserData"> 

export const DeleteProjectMemberRequestSchema = z.object({
  targetUserId: z.string(),
  projectId:z.string(),
  authUserData:UserSchema
}).strict();
export type DeleteProjectMemberRequestBodyType = z.infer<typeof DeleteProjectMemberRequestSchema>
export type DeleteProjectMemberRequestDBBodyType = Omit<DeleteProjectMemberRequestBodyType,"authUserData"> 

export const CreateTeamLinkRequestSchema = z.object({
  projectId:z.string(),
  teamId:z.string(),
  authUserData:UserSchema
}).strict()

export type CreateTeamLinkRequestBodyType = z.infer<typeof CreateTeamLinkRequestSchema>
export type CreateTeamLinkRequestDBBodyType = Omit<CreateTeamLinkRequestBodyType,"authUserData">
export type ProjectMemberDBBodyType = {
  role:ProjectRoleType,
  userId:string,
  projectId:string
}


