import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CreateTeamRequest, CreateTeamResponse, DeleteTeamRequest, DeleteTeamResponse, DeleteTeamResponseData, GetTeamRequest, GetTeamResponse, Team } from "@shipto/proto";
import TeamService from "services/team.service";
import { CreateTeamRequestBodyType, DeleteTeamRequestBodyType, GetTeamRequestBodyType } from "types/team";

class ProjectHandlers {
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
       } catch (error) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
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
       } catch (error) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }


    async handleDeleteTeam(call:ServerUnaryCall<DeleteTeamRequest & {body:DeleteTeamRequestBodyType},DeleteTeamResponse>,callback:sendUnaryData<DeleteTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.deleteTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const data = new DeleteTeamResponseData({message});
          const response = new DeleteTeamResponse({code,res:data,message});
          callback(null,response);
       } catch (error) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }
}