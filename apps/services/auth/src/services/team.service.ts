import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import dbService from "db/dbService";
import { CreateTeamRequestBodyType, DeleteTeamMemberRequestBodyType, DeleteTeamRequestBodyType, GetTeamMemberRequestBodyType, GetTeamMemberRequestDBBodyType, GetTeamRequestBodyType, TeamMemberInvitationRequestBodyType, TeamRoleType } from "types/team";
import { AcceptMemberInviteRequestBodyType } from "types/utility";
import { Permission } from "utils/rbac-utils";
import AuthResponse from "utils/response";
import { HandleServiceErrors } from "utils/service-error";

class TeamService {
   
    private _permissions : Permission
    constructor(){
      this._permissions = new Permission()
    }

    async createTeam({teamName,description,authUserData:{userId}}:CreateTeamRequestBodyType){
        try {
            const team = await dbService.createTeam({teamName,description,userId});
            return AuthResponse.OK(team,"Team created")
        } catch (e) {
            return AuthResponse.INTERNAL()
        }
    }

    async getTeam({teamId,authUserData:{userId}}:GetTeamRequestBodyType){
        try {
            await this._permissions.canReadTeam(userId,teamId);
            const t = await dbService.findUniqueTeamById(teamId);
            return AuthResponse.OK(t,"Team found");
        } catch (e) {
            return HandleServiceErrors(e,"Team",{PERMISSION_DENIED:"User does not have permissions to get the team"})
        }
    }

    async deleteTeam({teamId,authUserData:{userId}}:DeleteTeamRequestBodyType){

       try {
           await this._permissions.canDeleteTeam(userId,teamId);
          const del = await dbService.deleteTeamById({teamId});
          return AuthResponse.OK(del,"Team deleted");
       } catch (e:any) {
         return HandleServiceErrors(e,"User",{NOT_FOUND:"Team not found"})
       }
    }

    async createTeamMemberInvitation({teamId,userId:targetUserId,role,authUserData:{userId}}:TeamMemberInvitationRequestBodyType){
        try {
           await this._permissions.canInviteTeamMember(userId,teamId)
           const invitation = await dbService.createTeamInvitation({teamId,userId:targetUserId,role})
           return AuthResponse.OK(invitation,"Invitation created")
       } catch (e:any) {
         return HandleServiceErrors(e,"User")
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId}}:AcceptMemberInviteRequestBodyType){
       try {
            const invite = await dbService.findTeamInviteById(inviteId);
            if(invite.expiresAt?.getMilliseconds() as number >= Date.now()){
                            throw new PrismaClientKnownRequestError("BAD_REQUEST",{code:"400",clientVersion:""})
            }
            const member = await dbService.createTeamMember({
                userId,
                role:invite.role as TeamRoleType,
                teamId:invite.teamId
            })
    
        return AuthResponse.OK(member,"Team joined");
       }  
        catch (e) {
          return HandleServiceErrors(e,null,{NOT_FOUND:"Invite not found",BAD_REQUEST:"Invite expired"});
       }
    }

    async getTeamMember({authUserData:{userId},targetUserId,teamId}:GetTeamMemberRequestBodyType){
     try {
        await this._permissions.canReadTeamMember(userId,teamId,targetUserId);
        const memeber = await dbService.findUniqueTeamMember({userId_teamId:{userId:targetUserId,teamId}});
        return AuthResponse.OK(memeber,"Team member found");
     } catch (e) {
        return HandleServiceErrors(e,"User");
     }
    }

    async deleteTeamMember({authUserData:{userId},targetUserId,teamId}:DeleteTeamMemberRequestBodyType){
        try {
            await this._permissions.canRemoveTeamMember(userId,teamId,targetUserId);
            const res = await dbService.deleteTeamMember({userId_teamId:{teamId,userId:targetUserId}})
            return AuthResponse.OK(res,"Team memeber deleted");
        } catch (e) {
            return HandleServiceErrors(e,"User")
        }
    }
}

export default TeamService