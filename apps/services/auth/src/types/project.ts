import { RolesGeneric, RoleTypeGenericType } from "types/utility";
import z from "zod";
import { UserBody } from "./user";

export const ProjectMemberInvitationRoles = RolesGeneric;
export type ProjectMemberInvitationRolesType = RoleTypeGenericType;

export const ProjectMemberInvitationRequestSchema = z.object({
  userId: z.string(),
  role: ProjectMemberInvitationRoles,
  projectId: z.string()
}).strict();
export type ProjectMemberInvitationRequestBodyType = z.infer<typeof ProjectMemberInvitationRequestSchema> & { authUserData: UserBody };
export type ProjectMemberInvitationRequestDBBodyType = z.infer<typeof ProjectMemberInvitationRequestSchema>

export const DeleteProjectRequestSchema = z.object({
    projectId: z.string(),
}).strict();
export type DeleteProjectRequestBodyType = z.infer<typeof DeleteProjectRequestSchema> & { authUserData: UserBody };
export type DeleteProjectRequestDBBodyType = z.infer<typeof DeleteProjectRequestSchema>;
