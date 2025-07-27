import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import AuthService from "services/auth.service";
import {LoginRequest,LoginResponse, Tokens} from "@shipto/proto";
import { EmailPassLoginSchema } from "types";
import { parseAsync, ZodError } from "zod";

class AuthHandlers {
    private _authService;
    constructor (){
       this._authService = new AuthService();
    }

    async handleLogin(call:ServerUnaryCall<LoginRequest,LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const parsedBody = await parseAsync(EmailPassLoginSchema,call.request.toObject());
            const {code,res,message} = await this._authService.login(parsedBody);
            if(code!==status.OK){
                return callback({
                    code:code,
                    message:message
                })
            }
            const tokens = new Tokens();
            const response = new LoginResponse();
            tokens.accessToken = res?.tokens.accessToken as string;
            tokens.refreshToken = res?.tokens.accessToken as string;
            response.code = code,
            response.message = message,
            response.res = tokens
            return callback(null,response)
        } catch (error) {
            if(error instanceof ZodError){
              return callback({
                code:status.INVALID_ARGUMENT,
                message:error.message
              })
            }
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    }
}

export default AuthHandlers