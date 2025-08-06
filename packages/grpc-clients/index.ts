import {AuthServiceClient} from "@shipto/proto";
import {credentials} from "@grpc/grpc-js"
 let AuthClientInstance : AuthServiceClient | null = null ;

 export const GetAuthClient = () => {
    if(!AuthClientInstance){
      AuthClientInstance = new AuthServiceClient(process.env.GRPC_AUTH_SERVER_URI || "localhost:50051",credentials.createInsecure())
    }
    return AuthClientInstance;
 }


 