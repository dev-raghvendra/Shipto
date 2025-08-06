import { createJwt } from "libs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import AuthResponse from "utils/response";
import { compare } from "libs/bcrypt";
import { HandleServiceErrors } from "utils/service-error";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, OAuthRequestBodyType, SigninRequestBodyType } from "types/user";
import { HasPermissionsRequestBodyType } from "types/utility";
import { BodyLessRequestBodyType } from "@shipto/types";
import { PermissionBase } from "utils/rbac-utils";
import dbService from "db/db-service";

class AuthService {

    private _permissions : PermissionBase

    constructor(){
        this._permissions = new PermissionBase()
    }

    private createSession(u: any) {
        return AuthResponse.OK({
                tokens: {
                    accessToken: createJwt(u),
                    refreshToken: createJwt(u, "7d"),
                },
            },"Session created")
    }

    async signIn(body: SigninRequestBodyType) {
        try {
            const u = await dbService.createEmailUser(body);
            return this.createSession(u);
        } catch (e : any) {
            return HandleServiceErrors({details:e,RPC:"SIGNIN"},null,{ALREADY_EXISTS:"User already exists with provided email"});
        }
    }

    async login(body: EmailPassLoginRequestBodyType) {
        try {
            const u = await dbService.findUniqueUser({
                where:{email:body.email}
            });
            const isVerified = await compare(body.password,u.password)
            if(!isVerified) throw new PrismaClientKnownRequestError("Invalid pass",{code:"P2025",clientVersion:"4"})
            const {password, ...user} = u;
            return this.createSession(user);
        } catch (e) {
            return HandleServiceErrors({details:e,RPC:"LOGIN"},null,{NOT_FOUND:"Invalid credentials"});
        }
    }

    async OAuth(body:OAuthRequestBodyType){
        try {
            const u = await dbService.createOAuthUser(body);
            return this.createSession(u);
        } catch (e) {
             if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === "P2002"
             ){
                return this.createSession(body);
             }
              return AuthResponse.INTERNAL({details:e,RPC:"OAUTH"})
        }
    }
    
    async GetUser(body:GetUserRequestBodyType){
        try {
            const u = await dbService.findUniqueUserById(body.targetUserId,{
                userId:true,
                avatarUri:true,
                fullName:true,
                createdAt:true,
                updatedAt:true,
                email:true
            });
            return AuthResponse.OK(u,"User found");
        } catch (e) {
           return HandleServiceErrors({details:e,RPC:"GETUSER"},"User");
        }
    }

    async GetMe(userId:string){
        try {
            const u = await dbService.findUniqueUserById(userId,{
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
            return AuthResponse.OK(u,"User found");
        } catch (e) {
            return HandleServiceErrors({details:e,RPC:"GETME"},"User")
        }
    }

    async refreshToken(body:BodyLessRequestBodyType){
      try {
        return this.createSession(body.authUserData);
      } catch (e) {
        return AuthResponse.INTERNAL(e)
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
        return AuthResponse.OK(has,"Permission derived");
     } catch (e) {
        return HandleServiceErrors({details:e,RPC:"HASPERMISSIONS"},"User")
     }
    }
}

export default AuthService;