import dbService from "db/dbService";
import { createJwt } from "libs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import AuthResponse from "utils/response";
import { compare } from "libs/bcrypt";
import { HandleServiceErrors } from "utils/service-error";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, RefreshTokenRequestBodyType, SigninRequestBodyType } from "types/user";
import { HasPermissionsRequestBodyType } from "types/utility";
import { PermissionBase } from "utils/rbac-utils";
import { convertDatesToISO } from "@shipto/services-commons";

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
            const u = await dbService.createUser(body);
            return this.createSession(u);
        } catch (e) {
            return HandleServiceErrors(e,null,{ALREADY_EXISTS:"User already exists with provided email"});
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
            return HandleServiceErrors(e,null,{NOT_FOUND:"Invalid credentials"});
        }
    }

    async OAuth(body:SigninRequestBodyType){
        try {
            const u = await dbService.createUser(body);
            return this.createSession(u);
        } catch (e) {
             if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === "P2002"
             ){
                return this.createSession(body);
             }
              return AuthResponse.INTERNAL()
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
            convertDatesToISO.apply(u)
            return AuthResponse.OK(u,"User found");
        } catch (e) {
           return HandleServiceErrors(e,"User");
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
            convertDatesToISO.apply(u)
            return AuthResponse.OK(u,"User found");
        } catch (e) {
            return HandleServiceErrors(e,"User")
        }
    }

    async refreshToken(body:RefreshTokenRequestBodyType){
      try {
        return this.createSession(body.authUserData);
      } catch (e) {
        return AuthResponse.INTERNAL()
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
     } catch (error) {
        return HandleServiceErrors(error,"User")
     }
    }
}

export default AuthService;