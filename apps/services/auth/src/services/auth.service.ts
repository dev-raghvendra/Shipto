import dbService from "db/dbService";
import { createJwt } from "libs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import AuthResponse from "utils/response";
import { compare } from "libs/bcrypt";
import { HandleServiceErrors } from "utils/service-error";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, RefreshTokenRequestBodyType, SigninRequestBodyType } from "types/user";

class AuthService {
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
            const u = await dbService.findUniqueUser({where:{email:body.email} ,select: {createdAt:false,updatedAt:false,_count:false }});
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
            const u = await dbService.findUniqueUserById(body.targetUserId,{password:false,createdAt:false,updatedAt:false,_count:false});
            return AuthResponse.OK(u,"User found");
        } catch (e) {
           return HandleServiceErrors(e,"User");
        }
    }

    async GetMe(userId:string){
        try {
            const u = await dbService.findUniqueUserById(userId,{createdAt:false,updatedAt:false})
            return AuthResponse.OK(u,"User found");
        } catch (e) {
            return HandleServiceErrors(e,"User")
        }
    }

    async refreshToken(body:RefreshTokenRequestBodyType){
      try {
        return this.createSession(body.authUserData);
      } catch (error) {
        return AuthResponse.INTERNAL()
      }
    }

    private createSession(u: any) {
        return AuthResponse.OK({
                tokens: {
                    accessToken: createJwt(u),
                    refreshToken: createJwt(u, "7d"),
                },
            },"Session created")
    }
}

export default AuthService;