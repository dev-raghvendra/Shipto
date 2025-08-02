import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CreateProjectMemberInvitationResponse, CreateProjectMemberInvitationRequest, CreateProjectMemberInvitationResponseData, AcceptInvitationRequest, GetTeamMemberResponse, GetTeamMemberResponseData} from "@shipto/proto";
import ProjectService from "services/project.service";
import { ProjectMemberInvitationRequestBodyType } from "types/project";
import { AcceptMemberInviteRequestBodyType } from "types/utility";

class ProjectHandlers {
    private _projectService : ProjectService;
    constructor(){
        this._projectService= new ProjectService()
    }

    async handleCreateProjectMemberInvitation(call:ServerUnaryCall<CreateProjectMemberInvitationRequest & {body:ProjectMemberInvitationRequestBodyType},CreateProjectMemberInvitationResponse>,callback:sendUnaryData<CreateProjectMemberInvitationResponse>){
       try {
          const {code,res,message} = await this._projectService.createProjectMemberInvitation(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const data = new CreateProjectMemberInvitationResponseData(res as Object);
          const response = new CreateProjectMemberInvitationResponse({code,res:data,message});
          callback(null,response);
       } catch (error) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleAcceptInvitation(call:ServerUnaryCall<AcceptInvitationRequest & {body:AcceptMemberInviteRequestBodyType},GetTeamMemberResponse>,callback:sendUnaryData<GetTeamMemberResponse>){
        try {
            const {code,res,message} = await this._projectService.acceptInvitation(call.request.body);
             if(code!==status.OK) return callback({code,message})  
            const data = new GetTeamMemberResponseData(res as Object);
            const response = new GetTeamMemberResponse({code,res:data,message});
            callback(null,response);
       } catch (error) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }
}

export default ProjectHandlers