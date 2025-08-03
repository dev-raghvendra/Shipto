import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UnimplementedAuthServiceService } from "@shipto/proto";
import AuthHandlers from "handlers/auth.handler";
import {createValidator} from "@shipto/services-commons"
import { RPC_SCHEMA } from "conf/rpc-schema";
import TeamHandlers from "handlers/team.handler";
import ProjectHandlers from "handlers/project.handlers";

const validateRPCBody = createValidator(RPC_SCHEMA);
const server = new Server();
const authhandlers = new AuthHandlers();
const teamHandlers = new TeamHandlers();
const projectHandlers = new ProjectHandlers();

server.addService(UnimplementedAuthServiceService.definition,{
    Login:validateRPCBody("Login",authhandlers.handleLogin),
    Signin:validateRPCBody("Signin",authhandlers.handleSignin),
    OAuth:validateRPCBody("OAuth",authhandlers.handleOAuth),
    GetUser:validateRPCBody("GetUser",authhandlers.handleGetUser),
    GetMe:validateRPCBody("GetMe",authhandlers.handleGetMe),
    RefreshToken:validateRPCBody("RefreshToken",authhandlers.handleRefreshToken),

    CreateTeam:validateRPCBody("CreateTeam",teamHandlers.handleCreateTeam),
    GetTeam:validateRPCBody("GetTeam",teamHandlers.handleGetTeam),
    DeleteTeam:validateRPCBody("DeleteTeam",teamHandlers.handleDeleteTeam),
    CreateTeamMemberInvitation:validateRPCBody("CreateTeamMemberInvitation",teamHandlers.handleCreateTeamMemberInvitation),
    AcceptTeamInvitation:validateRPCBody("AcceptTeamInvitation",teamHandlers.handleAcceptTeamInvitation),
    GetTeamMember:validateRPCBody("GetTeamMember",teamHandlers.handleGetTeamMember),
    DeleteTeamMember:validateRPCBody("DeleteTeamMember",teamHandlers.handleDeleteTeamMember),

    CreateProjectMemberInvitation:validateRPCBody("CreateProjectMemberInvitation",projectHandlers.handleCreateProjectMemberInvitation),
    AcceptProjectInvitation:validateRPCBody("AcceptProjectInvitation",projectHandlers.handleAcceptInvitation),
    GetProjectMember:validateRPCBody("GetProjectMember",projectHandlers.handleGetProjectMember),
    DeleteProjectMember:validateRPCBody("DeleteProjectMember",projectHandlers.handleDeleteProjectMember),
})

server.bindAsync("localhost:50051",ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        console.error("Failed to bind gRPC server:", err);
        process.exit(1);
      }
      console.log(`gRPC server listening on ${"localhost"} (port ${50051})`);
})

