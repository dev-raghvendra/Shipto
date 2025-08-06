import { status } from "@grpc/grpc-js";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipto/services-commons";
import   { Database, dbService } from "db/db-service";
import { CreateTeamRequestBodyType, DeleteTeamMemberRequestBodyType, DeleteTeamRequestBodyType, GetTeamMemberRequestBodyType, GetTeamRequestBodyType, TeamMemberInvitationRequestBodyType } from "types/team";
import { AcceptMemberInviteRequestBodyType, BulkResourceRequestBodyType } from "types/utility";
import { Permission } from "utils/rbac-utils";

class TeamService {
   
    private _permissions : Permission
    private _dbService : Database;
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>
    constructor(){
      this._permissions = new Permission()
      this._dbService = dbService;
      this._errorHandler = createGrpcErrorHandler({serviceName:"AUTH_SERVICE"});
    }

    async createTeam({teamName,description,authUserData:{userId}}:CreateTeamRequestBodyType){
        try {
            const team = await this._dbService.createTeam({teamName,description,userId});
            return GrpcResponse.OK(team,"Team created")
        } catch (e:any) {
            return this._errorHandler(e,"CREATE-TEAM");
        }
    }

    async getTeam({teamId,authUserData:{userId}}:GetTeamRequestBodyType){
        try {
            await this._permissions.canReadTeam(userId,teamId);
            const t = await this._dbService.findUniqueTeam({
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
            return GrpcResponse.OK(t,"Team found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-TEAM");
        }
    }

    async deleteTeam({teamId,authUserData:{userId}}:DeleteTeamRequestBodyType){

       try {
          await this._permissions.canDeleteTeam(userId,teamId);
          const del = await this._dbService.deleteTeamById({teamId});
          return GrpcResponse.OK(del,"Team deleted");
       } catch (e:any) {
         return this._errorHandler(e,"DELETE-TEAM");
       }
    }

    async createTeamMemberInvitation({teamId,role,authUserData:{userId}}:TeamMemberInvitationRequestBodyType){
        try {
           await this._permissions.canInviteTeamMember(userId,teamId)
           const invitation = await this._dbService.createTeamInvitation({teamId,role})
           return GrpcResponse.OK(invitation,"Invitation created")
       } catch (e:any) {
         return this._errorHandler(e,"CREATE-TEAM-MEMBER-INVITATION")
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId}}:AcceptMemberInviteRequestBodyType){
       try {
            const {expiresAt,teamId,role} = await this._dbService.findTeamInviteById(inviteId);
            if(expiresAt?.getMilliseconds() as number >= Date.now()){
                            throw new GrpcAppError(status.INVALID_ARGUMENT,"Invite expired",null);
            }
            const member = await this._dbService.createTeamMember({
                userId,
                teamId,
                role,
            })

        return GrpcResponse.OK(member,"Team joined");
       }  
        catch (e:any) {
          return this._errorHandler(e,"ACCEPT-TEAM-MEMBER-INVITATION");
       }
    }

    async getTeamMember({authUserData:{userId},targetUserId,teamId}:GetTeamMemberRequestBodyType){
     try {
        await this._permissions.canReadTeamMember(userId,teamId,targetUserId);
        const member = await this._dbService.findUniqueTeamMember({userId_teamId:{userId:targetUserId,teamId}});
        return GrpcResponse.OK(member,"Team member found");
     } catch (e:any) {
        return this._errorHandler(e,"GET-TEAM-MEMBER");
     }
    }

    async deleteTeamMember({authUserData:{userId},targetUserId,teamId}:DeleteTeamMemberRequestBodyType){
        try {
            await this._permissions.canRemoveTeamMember(userId,teamId,targetUserId);
            const res = await this._dbService.deleteTeamMember({userId_teamId:{teamId,userId:targetUserId}})
            return GrpcResponse.OK(res,"Team member deleted");
        } catch (e:any) {
            return this._errorHandler(e,"DELETE-TEAM-MEMBER");
        }
    }

    async GetAllUserTeams({authUserData:{userId},skip,limit:take}:BulkResourceRequestBodyType){
        try {
            const res = await this._dbService.findTeams({
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
            return GrpcResponse.OK(res,"User's teams found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-ALL-USER-TEAMS");
        }
    }

}

export default TeamService