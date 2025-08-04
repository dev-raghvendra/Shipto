import { status } from "@grpc/grpc-js";
import { convertDatesToISO } from "@shipto/services-commons";
import logger from "@shipto/services-commons/libs/winston";

class AuthServiceResponse {
     OK<t>(r:t,message:string){
        convertDatesToISO.apply(r as Object)
        return {
            code:status.OK,
            res:r,
            message
        }
     }
     INTERNAL(e?:any){
        logger.error(`ERROR_IN_AUTH_SERVICE_${e.details} ${JSON.stringify(e,null,4)}`)
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
     UN_AUTHENTICATD<t>(r:t,message?:string){
        return {
            code:status.UNAUTHENTICATED,
            res:r,
            message
        }
     }
}

const AuthResponse = new AuthServiceResponse();

export default AuthResponse;