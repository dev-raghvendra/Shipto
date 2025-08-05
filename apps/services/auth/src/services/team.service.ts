import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import dbService from "db/dbService";
import { CreateTeamRequestBodyType, DeleteTeamMemberRequestBodyType, DeleteTeamRequestBodyType, GetTeamMemberRequestBodyType, GetTeamRequestBodyType, TeamMemberInvitationRequestBodyType } from "types/team";
import { AcceptMemberInviteRequestBodyType, BulkResourceRequestBodyType } from "types/utility";
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
            return AuthResponse.INTERNAL({details:e,RPC:"CREATE-TEAM"})
        }
    }

    async getTeam({teamId,authUserData:{userId}}:GetTeamRequestBodyType){
        try {
            await this._permissions.canReadTeam(userId,teamId);
            const t = await dbService.findUniqueTeam({
                where:{
                    teamId
                },
                include:{
                    teamMembers:{
                        include:{
                            member:true
                        }
                    }
                }
            });
            return AuthResponse.OK(t,"Team found");
        } catch (e) {
            return HandleServiceErrors({details:e,RPC:"GET-TEAM"},"Team",{PERMISSION_DENIED:"User does not have permissions to get the team"})
        }
    }

    async deleteTeam({teamId,authUserData:{userId}}:DeleteTeamRequestBodyType){

       try {
           await this._permissions.canDeleteTeam(userId,teamId);
          const del = await dbService.deleteTeamById({teamId});
          return AuthResponse.OK(del,"Team deleted");
       } catch (e:any) {
         return HandleServiceErrors({details:e,RPC:"DELETE-TEAM"},"User",{NOT_FOUND:"Team not found"})
       }
    }

    async createTeamMemberInvitation({teamId,role,authUserData:{userId}}:TeamMemberInvitationRequestBodyType){
        try {
           await this._permissions.canInviteTeamMember(userId,teamId)
           const invitation = await dbService.createTeamInvitation({teamId,role})
           return AuthResponse.OK(invitation,"Invitation created")
       } catch (e:any) {
         return HandleServiceErrors({details:e,RPC:"CREATE-TEAM-MEMBER-INVITATION"},"User")
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId}}:AcceptMemberInviteRequestBodyType){
       try {
            const {expiresAt,teamId,role} = await dbService.findTeamInviteById(inviteId);
            if(expiresAt?.getMilliseconds() as number >= Date.now()){
                            throw new PrismaClientKnownRequestError("BAD_REQUEST",{code:"400",clientVersion:""})
            }
            const member = await dbService.createTeamMember({
                userId,
                teamId,
                role,
            })
    
        return AuthResponse.OK(member,"Team joined");
       }  
        catch (e) {
          return HandleServiceErrors({details:e,RPC:"ACCEPT-TEAM-MEMBER-INVITATION"},null,{NOT_FOUND:"Invite not found",BAD_REQUEST:"Invite expired"});
       }
    }

    async getTeamMember({authUserData:{userId},targetUserId,teamId}:GetTeamMemberRequestBodyType){
     try {
        await this._permissions.canReadTeamMember(userId,teamId,targetUserId);
        const member = await dbService.findUniqueTeamMember({userId_teamId:{userId:targetUserId,teamId}});
        return AuthResponse.OK(member,"Team member found");
     } catch (e) {
        return HandleServiceErrors({details:e,RPC:"GET-TEAM-MEMBER"},"User");
     }
    }

    async deleteTeamMember({authUserData:{userId},targetUserId,teamId}:DeleteTeamMemberRequestBodyType){
        try {
            await this._permissions.canRemoveTeamMember(userId,teamId,targetUserId);
            const res = await dbService.deleteTeamMember({userId_teamId:{teamId,userId:targetUserId}})
            return AuthResponse.OK(res,"Team member deleted");
        } catch (e) {
            return HandleServiceErrors({details:e,RPC:"DELETE-TEAM-MEMBER"},"User")
        }
    }

    async GetAllUserTeams({authUserData:{userId},skip,limit:take}:BulkResourceRequestBodyType){
        try {
            const res = await dbService.findTeams({
                where:{
                    teamMembers:{
                        some:{
                            userId
                        }
                    }
                },
                skip,
                take
            })
            if(res.length) return AuthResponse.OK(res,"Teams found");
            return AuthResponse.NOT_FOUND(null,"User's team not found")
        } catch (e) {
            return HandleServiceErrors({e,details:"GET-ALL-USER-TEAMS"},"User")
        }
    }

}

export default TeamService