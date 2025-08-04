import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UnimplementedAuthServiceService } from "@shipto/proto";
import AuthHandlers from "handlers/auth.handler";
import {createValidator} from "@shipto/services-commons"
import { RPC_SCHEMA } from "conf/rpc-schema";
import TeamHandlers from "handlers/team.handler";
import ProjectHandlers from "handlers/project.handlers";
import logger from "@shipto/services-commons/libs/winston";
import SECRETS from "conf/secrets";

const validateRPCBody = createValidator(RPC_SCHEMA);
const server = new Server();
const authhandlers = new AuthHandlers();
const teamHandlers = new TeamHandlers();
const projectHandlers = new ProjectHandlers();

server.addService(UnimplementedAuthServiceService.definition, {
    Login: validateRPCBody("Login", authhandlers.handleLogin.bind(authhandlers)),
    Signin: validateRPCBody("Signin", authhandlers.handleSignin.bind(authhandlers)),
    OAuth: validateRPCBody("OAuth", authhandlers.handleOAuth.bind(authhandlers)),
    GetUser: validateRPCBody("GetUser", authhandlers.handleGetUser.bind(authhandlers)),
    GetMe: validateRPCBody("GetMe", authhandlers.handleGetMe.bind(authhandlers)),
    RefreshToken: validateRPCBody("RefreshToken", authhandlers.handleRefreshToken.bind(authhandlers)),
    HasPermissions: validateRPCBody("HasPermissions", authhandlers.handleHasPermissions.bind(authhandlers)),

    CreateTeam: validateRPCBody("CreateTeam", teamHandlers.handleCreateTeam.bind(teamHandlers)),
    GetTeam: validateRPCBody("GetTeam", teamHandlers.handleGetTeam.bind(teamHandlers)),
    DeleteTeam: validateRPCBody("DeleteTeam", teamHandlers.handleDeleteTeam.bind(teamHandlers)),
    CreateTeamMemberInvitation: validateRPCBody("CreateTeamMemberInvitation", teamHandlers.handleCreateTeamMemberInvitation.bind(teamHandlers)),
    AcceptTeamInvitation: validateRPCBody("AcceptTeamInvitation", teamHandlers.handleAcceptTeamInvitation.bind(teamHandlers)),
    GetTeamMember: validateRPCBody("GetTeamMember", teamHandlers.handleGetTeamMember.bind(teamHandlers)),
    DeleteTeamMember: validateRPCBody("DeleteTeamMember", teamHandlers.handleDeleteTeamMember.bind(teamHandlers)),

    CreateProjectMemberInvitation: validateRPCBody("CreateProjectMemberInvitation", projectHandlers.handleCreateProjectMemberInvitation.bind(projectHandlers)),
    AcceptProjectInvitation: validateRPCBody("AcceptProjectInvitation", projectHandlers.handleAcceptInvitation.bind(projectHandlers)),
    GetProjectMember: validateRPCBody("GetProjectMember", projectHandlers.handleGetProjectMember.bind(projectHandlers)),
    DeleteProjectMember: validateRPCBody("DeleteProjectMember", projectHandlers.handleDeleteProjectMember.bind(projectHandlers)),
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        logger.error(`ERROR_STARTING_AUTH_GRPC_SERVER: ${JSON.stringify(err,null,4)}`)
        process.exit(1);
    }
      logger.info(`AUTH_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})

