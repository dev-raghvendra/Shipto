import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { AcceptInvitationRequest, CreateTeamMemberInvitationRequest, CreateTeamMemberInvitationResponse, CreateTeamMemberInvitationResponseData, CreateTeamRequest, CreateTeamResponse, DeleteTeamMemberRequest, DeleteTeamMemberResponse, DeleteTeamMemberResponseData, DeleteTeamRequest, DeleteTeamResponse, GetTeamMemberRequest, GetTeamMemberResponse, GetTeamMemberResponseData, GetTeamRequest, GetTeamResponse, Team } from "@shipto/proto";
import TeamService from "services/team.service";
import { CreateTeamRequestBodyType, DeleteTeamMemberRequestBodyType, DeleteTeamRequestBodyType, GetTeamMemberRequestBodyType, GetTeamRequestBodyType, TeamMemberInvitationRequestBodyType } from "types/team";
import { AcceptMemberInviteRequestBodyType } from "types/utility";

class TeamHandlers {
    private _teamService : TeamService;
    constructor(){
        this._teamService= new TeamService()
    }

    async handleCreateTeam(call:ServerUnaryCall<CreateTeamRequest & {body:CreateTeamRequestBodyType},CreateTeamResponse>,callback:sendUnaryData<CreateTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.createTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const data = new Team(res as Object);
          const response = new CreateTeamResponse({code,res:data,message});
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server e"
          }) 
       }
    }

    async handleGetTeam(call:ServerUnaryCall<GetTeamRequest & {body:GetTeamRequestBodyType},GetTeamResponse>,callback:sendUnaryData<GetTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.getTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const data = new Team(res as Object);
          const response = new GetTeamResponse({code,res:data,message});
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server e"
          }) 
       }
    }

    async handleDeleteTeam(call:ServerUnaryCall<DeleteTeamRequest & {body:DeleteTeamRequestBodyType},DeleteTeamResponse>,callback:sendUnaryData<DeleteTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.deleteTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const data = new Team(res as Object);
          const response = new DeleteTeamResponse({code,res:data,message});
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server e"
          }) 
       }
    }

    async handleCreateTeamMemberInvitation(call:ServerUnaryCall<CreateTeamMemberInvitationRequest & {body:TeamMemberInvitationRequestBodyType},CreateTeamMemberInvitationResponse>,callback:sendUnaryData<CreateTeamMemberInvitationResponse>){
      try {
         const {code,res,message} = await this._teamService.createTeamMemberInvitation(call.request.body);
         if(code!==status.OK) return callback({code,message});
         const data = new CreateTeamMemberInvitationResponseData(res as Object);
         const response = new CreateTeamMemberInvitationResponse({code,message,res:data});
         return callback(null,response)
      } catch (e) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server e"
          }) 
      }
    }

    async handleAcceptTeamInvitation(call:ServerUnaryCall<AcceptInvitationRequest & {body:AcceptMemberInviteRequestBodyType},GetTeamMemberResponse>,callback:sendUnaryData<GetTeamMemberResponse>){
            try {
                const {code,res,message} = await this._teamService.acceptInvitation(call.request.body);
                 if(code!==status.OK) return callback({code,message})  
                const data = new GetTeamMemberResponseData(res as Object);
                const response = new GetTeamMemberResponse({code,res:data,message});
                callback(null,response);
           } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server e"
              }) 
           }
    }

    async handleGetTeamMember(call:ServerUnaryCall<GetTeamMemberRequest & {body:GetTeamMemberRequestBodyType},GetTeamMemberResponse>,callback:sendUnaryData<GetTeamMemberResponse>){
      try {
         const {code,res,message} = await this._teamService.getTeamMember(call.request.body);
         if(code!==status.OK) return callback({code,message})
         const data = new GetTeamMemberResponseData(res as object);
         const response = new GetTeamMemberResponse({code,message,res:data})
         return callback(null,response);
      } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server e"
              }) 
      }
    }

    async handleDeleteTeamMember(call:ServerUnaryCall<DeleteTeamMemberRequest & {body:DeleteTeamMemberRequestBodyType},DeleteTeamMemberResponse>,callback:sendUnaryData<DeleteTeamMemberResponse>){
      try {
         const {code,res,message} = await this._teamService.deleteTeamMember(call.request.body);
         if(code!==status.OK) return callback({code,message})
         const data = new DeleteTeamMemberResponseData(res as object);
         const response = new DeleteTeamMemberResponse({code,message,res:data});
         return callback(null,response);
      } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server e"
              }) 
      }
    }
}

export default TeamHandlers