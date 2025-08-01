import { status } from "@grpc/grpc-js";

class AuthServiceResponse {
     OK<t>(r:t,message:string){
        return {
            code:status.OK,
            res:r,
            message
        }
     }
     INTERNAL(){
        return {
            code:status.INTERNAL,
            res:null,
            message:"Internal server error"
        }
     }
     FORBIDDEN<t>(r:t ,message?:string | "Permission denied"){
        return {
            code:status.PERMISSION_DENIED,
            res:r,
            message
        }
     }
     NOT_FOUND<t>(r:t,message?:string | "Not found",){
        return {
            code:status.NOT_FOUND,
            res:r,
            message
        }
     }
     ALREADY_EXISTS<t>(r:t,message?:string | "Already exists"){
        return{
            code :status.ALREADY_EXISTS,
            res:r,
            message
        }
     }
}

const AuthResponse = new AuthServiceResponse();

export default AuthResponse;