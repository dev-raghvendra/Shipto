import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import AuthService from "services/auth.service";
import {BodyLessRequests, GetUserRequest, GetUserResponse, GetUserResponseData, LoginRequest,LoginResponse, RefreshTokenRequest, SigninRequest, Tokens, User} from "@shipto/proto";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, RefreshTokenRequestBodyType, SigninRequestBodyType } from "types/user";

class AuthHandlers {
    private _authService;
    constructor (){
       this._authService = new AuthService();
    }

    async handleLogin(call:ServerUnaryCall<LoginRequest & {body:EmailPassLoginRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
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

    async handleSignin(call:ServerUnaryCall<SigninRequest & {body:SigninRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
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

    async handleOAuth(call:ServerUnaryCall<SigninRequest & {body:SigninRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
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

    async handleGetUser(call:ServerUnaryCall<GetUserRequest & {body:GetUserRequestBodyType},GetUserResponse>,callback:sendUnaryData<GetUserResponse>){
        try {
            const {code,message,res} = await this._authService.GetUser(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const data = new GetUserResponseData(res as Object)
            const response = new GetUserResponse({code,message,res:data})
            callback(null,response)
        } catch (error) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          })  
        }
    }

    async handleGetMe(call:ServerUnaryCall<BodyLessRequests & {body:GetUserRequestBodyType},GetUserResponse>,callback:sendUnaryData<GetUserResponse>){
       try {
          const {code,res,message} = await this._authService.GetMe(call.request.authUserData.userId)
          if(code!==status.OK) return callback({code,message});
          const data = new GetUserResponseData(res as Object)
          const response = new GetUserResponse({code,message,res:data})
          callback(null,response)
        } catch (error) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          })  
        }
    }

    async handleRefreshToken(call:ServerUnaryCall<RefreshTokenRequest & {body:RefreshTokenRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {res,code,message} = await this._authService.refreshToken(call.request.body);
            if(code!==status.OK) return callback({code,message});
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