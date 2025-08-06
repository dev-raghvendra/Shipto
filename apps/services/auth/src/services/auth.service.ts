import { createJwt } from "libs/jwt";
import { compare } from "libs/bcrypt";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, OAuthRequestBodyType, SigninRequestBodyType } from "types/user";
import { HasPermissionsRequestBodyType } from "types/utility";
import { BodyLessRequestBodyType } from "@shipto/types";
import { PermissionBase } from "utils/rbac-utils";
import { Database, dbService } from "db/db-service";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipto/services-commons";
import { status } from "@grpc/grpc-js";


class AuthService {

    private _permissions : PermissionBase
    private _dbService : Database
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>

    constructor(){
        this._permissions = new PermissionBase()
        this._dbService = dbService;
        this._errorHandler = createGrpcErrorHandler({serviceName:"AUTH_SERVICE"});
    }

    private createSession(u: any) {
        return GrpcResponse.OK({
                tokens: {
                    accessToken: createJwt(u),
                    refreshToken: createJwt(u, "7d"),
                },
            },"Session created")
    }

    async signIn(body: SigninRequestBodyType) {
        try {
            const u = await this._dbService.createEmailUser(body);
            return this.createSession(u);
        } catch (e : any) {
            return this._errorHandler(e,"SIGNIN");
        }
    }

    async login(body: EmailPassLoginRequestBodyType) {
        try {
            const u = await this._dbService.findUniqueUser({
                where:{email:body.email}
            });
            const isVerified = await compare(body.password,u.password)
            if(!isVerified) throw new GrpcAppError(status.NOT_FOUND,"Invalid credentials",null);
            const {password, ...user} = u;
            return this.createSession(user);
        } catch (e:any) {
            return this._errorHandler(e,"LOGIN");
        }
    }

    async OAuth(body:OAuthRequestBodyType){
        try {
            const u = await this._dbService.createOAuthUser(body);
            return this.createSession(u);
        } catch (e:any) {
             if (e.code === status.ALREADY_EXISTS){
                return this.createSession(body);
             }
            return this._errorHandler(e,"OAUTH");
        }
    }
    
    async GetUser(body:GetUserRequestBodyType){
        try {
            const u = await this._dbService.findUniqueUserById(body.targetUserId,{
                userId:true,
                avatarUri:true,
                fullName:true,
                createdAt:true,
                updatedAt:true,
                email:true
            });
            return GrpcResponse.OK(u,"User found");
        } catch (e:any) {
           return this._errorHandler(e,"GET-USER");
        }
    }

    async GetMe(userId:string){
        try {
            const u = await this._dbService.findUniqueUserById(userId,{
                userId:true,
                fullName:true,
                avatarUri:true,
                email:true,
                provider:true,
                createdAt:true,
                updatedAt:true,
                password:true,
                teamMembers:true,
                projectMembers:true
            })
            return GrpcResponse.OK(u,"User found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-ME");
        }
    }

    async refreshToken(body:BodyLessRequestBodyType){
      try {
        return this.createSession(body.authUserData);
      } catch (e:any) {
        return this._errorHandler(e,"REFRESH_TOKEN");
      }
    }

    async hasPermissions({authUserData:{userId},resourceId,permissions,scope,targetUserId}:HasPermissionsRequestBodyType){
     try {
        const has = await this._permissions.canAccess({
            userId,
            resourceId,
            permission:permissions,
            scope,
            targetUserId
        })
        return GrpcResponse.OK(has,"Permission derived");
     } catch (e:any) {
        return this._errorHandler(e,"HAS-PERMISSIONS");
     }
    }
}

export default AuthService;