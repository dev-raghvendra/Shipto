import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CreateProjectMemberInvitationResponse, CreateProjectMemberInvitationRequest, CreateProjectMemberInvitationResponseData, AcceptInvitationRequest, GetProjectMemberResponse, GetProjectMemberResponseData, GetProjectMemberRequest, DeleteProjectMemberRequest, DeleteProjectMemberResponse, DeleteProjectMemberResponseData, BodyLessRequest, GetAllUserProjectIdsResponse} from "@shipto/proto";
import ProjectService from "services/project.service";
import { DeleteProjectMemberRequestBodyType, GetProjectMemberRequestBodyType, ProjectMemberInvitationRequestBodyType } from "types/project";
import { AcceptMemberInviteRequestBodyType, BodyLessRequestBodyType } from "types/utility";

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
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleAcceptInvitation(call:ServerUnaryCall<AcceptInvitationRequest & {body:AcceptMemberInviteRequestBodyType},GetProjectMemberResponse>,callback:sendUnaryData<GetProjectMemberResponse>){
        try {
            const {code,res,message} = await this._projectService.acceptInvitation(call.request.body);
             if(code!==status.OK) return callback({code,message})  
            const data = new GetProjectMemberResponseData(res as Object);
            const response = new GetProjectMemberResponse({code,res:data,message});
            callback(null,response);
       } catch (e) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleGetProjectMember(call:ServerUnaryCall<GetProjectMemberRequest & {body:GetProjectMemberRequestBodyType},GetProjectMemberResponse>,callback:sendUnaryData<GetProjectMemberResponse>){
       try {
             const {code,res,message} = await this._projectService.getProjectMember(call.request.body);
             if(code!==status.OK) return callback({code,message})
             const data = new GetProjectMemberResponseData(res as object);
             const response = new GetProjectMemberResponse({code,message,res:data})
             return callback(null,response);
          } catch (e) {
                    return callback({
                        code:status.INTERNAL,
                        message:"Internal server error"
                  }) 
          }
    }
    
    async handleDeleteProjectMember(call:ServerUnaryCall<DeleteProjectMemberRequest & {body:DeleteProjectMemberRequestBodyType},DeleteProjectMemberResponse>,callback:sendUnaryData<DeleteProjectMemberResponse>){
          try {
             const {code,res,message} = await this._projectService.deleteProjectMember(call.request.body);
             if(code!==status.OK) return callback({code,message})
             const data = new DeleteProjectMemberResponseData(res as object);
             const response = new DeleteProjectMemberResponse({code,message,res:data});
             return callback(null,response);
         } catch (e) {
            return callback({
               code:status.INTERNAL,
               message:"Internal server error"
            }) 
         }
      }
      
      async handleGetAllUserProjectIds(call:ServerUnaryCall<BodyLessRequest & {body:BodyLessRequestBodyType},GetAllUserProjectIdsResponse>,callback:sendUnaryData<GetAllUserProjectIdsResponse>){
         try {
            const {code,res,message} = await this._projectService.GetAllUserProjectIds(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = new GetAllUserProjectIdsResponse({code,message,res : res as string[]})  
            return callback(null,response)
         } catch (e) {
            return callback({
               code:status.INTERNAL,
               message:"Internal server error"
            }) 
         }
    }
}

export default ProjectHandlers