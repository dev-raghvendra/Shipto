import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import dbService from "db/dbService";
import { ProjectMemberInvitationRequestBodyType, ProjectMemberInvitationRolesType } from "types/project";
import { AcceptMemberInviteRequestBodyType } from "types/utility";
import { Permission } from "utils/rbac-utils";
import AuthResponse from "utils/response";
import { HandleServiceErrors } from "utils/service-error";

class ProjectService {
    private _permissions : Permission
    constructor(){
      this._permissions = new Permission()
    }
        async createProjectMemberInvitation({authUserData:{userId},projectId,userId:targetUserId,role}:ProjectMemberInvitationRequestBodyType){
        // cache code
        try {
            await this._permissions.canInviteProjectMember(userId,projectId);
            const invitation = await dbService.createProjectInvitation({projectId,userId:targetUserId,role})
           return AuthResponse.OK(invitation,"Invitation created")
        } catch (e:any) {
         return HandleServiceErrors(e,null,{PERMISSION_DENIED:"User is not  the owner of project"})
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId}}:AcceptMemberInviteRequestBodyType){
       try {
            const invite = await dbService.findProjectInviteById(inviteId);
            if(invite.expiresAt?.getMilliseconds() as number >= Date.now()){
                throw new PrismaClientKnownRequestError("BAD_REQUEST",{code:"400",clientVersion:""})
            }

            const member = await dbService.createProjectMember({
                userId,
                role:invite.role as ProjectMemberInvitationRolesType,
                projectId:invite.projectId
            })
    
        return AuthResponse.OK(member,"Project joined");
       }  
        catch (e) {
          return HandleServiceErrors(e,null,{NOT_FOUND:"Invite not found",BAD_REQUEST:"Invite expired"});
       }
}
}

export default ProjectService
