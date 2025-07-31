import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import AuthService from "services/auth.service";
import {LoginRequest,LoginResponse, SigninRequest, Tokens} from "@shipto/proto";
import { EmailPassLoginSchemaType, SigninRequestSchemaType } from "types";

class AuthHandlers {
    private _authService;
    constructor (){
       this._authService = new AuthService();
    }

    async handleLogin(call:ServerUnaryCall<LoginRequest & {body:EmailPassLoginSchemaType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            
            const {code,res,message} = await this._authService.login(call.request.body);
            if(code!==status.OK){
                return callback({
                    code:code,
                    message:message
                })
            }
            const tokens = new Tokens({accessToken : res?.tokens.accessToken ,refreshToken :res?.tokens.refreshToken });
            const response = new LoginResponse({code,message,res:tokens})
            return callback(null,response)
        } catch (error) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    }

    async handleSignin(call:ServerUnaryCall<SigninRequest & {body:SigninRequestSchemaType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {code,message,res} = await this._authService.signIn(call.request.body);
            if(code!==status.OK)return callback({code,message})
            const tokens = new Tokens({accessToken : res?.tokens.accessToken ,refreshToken :res?.tokens.refreshToken });
            const response = new LoginResponse({code,message,res:tokens})
            return callback(null,response)
        } catch (error) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    } 

    async handleOAuth(call:ServerUnaryCall<SigninRequest & {body:SigninRequestSchemaType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {code,message,res} = await this._authService.OAuth(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const tokens = new Tokens({accessToken : res?.tokens.accessToken ,refreshToken :res?.tokens.refreshToken });
            const response = new LoginResponse({code,message,res:tokens})
            return callback(null,response)
        } catch (error) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    }
}

export default AuthHandlers