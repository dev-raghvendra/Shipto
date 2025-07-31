import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UnimplementedAuthServiceService } from "@shipto/proto";
import AuthHandlers from "handlers/auth.handler";
import {createValidator} from "@shipto/services-commons"
import { RPC_SCHEMA } from "conf/rpc-schema";

const validateRPCBody = createValidator(RPC_SCHEMA);
const server = new Server();
const authhandlers = new AuthHandlers();
server.addService(UnimplementedAuthServiceService.definition,{
    Login:validateRPCBody("Login",authhandlers.handleLogin),
    Signin:validateRPCBody("Signin",authhandlers.handleSignin),
    OAuth:validateRPCBody("OAuth",authhandlers.handleOAuth)
})

server.bindAsync("localhost:50051",ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        console.error("Failed to bind gRPC server:", err);
        process.exit(1);
      }
      console.log(`gRPC server listening on ${"localhost"} (port ${50051})`);
})

