import dbService from "db/dbService";
import { status } from "@grpc/grpc-js";
import { CreateTeamRequestSchemaType, DeleteTeamRequestSchemaType, EmailPassLoginSchemaType, GetTeamRequestSchemaType, GetUserRequestSchemaType, RefreshTokenRequestSchemaType, SigninRequestSchemaType, TeamMemberInvitationSchemaType } from "types";
import { Prisma } from "@prisma/index";
import { createJwt } from "libs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import { hasPermission } from "utils/rbac-utils";

class AuthService {
    async signIn(body: SigninRequestSchemaType) {
        try {
            const u = await dbService.createUser(body);
            return this.createSession(u);
        } catch (e) {
            if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002"
            ) {
                return {
                    code: status.ALREADY_EXISTS,
                    res: null,
                    message: "User already exists with provided email",
                };
            }
            return {
                code: status.INTERNAL,
                res: null,
                message: "Internal server error",
            };
        }
    }

    async login(body: EmailPassLoginSchemaType) {
        try {
            const u = await dbService.findUniqueUser(body, { password: false,createdAt:false,updatedAt:false });
            return this.createSession(u);
        } catch (e) {
            if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2025"
            ) {
                return {
                    code: status.NOT_FOUND,
                    res: null,
                    message: "Invalid credentials",
                };
            }
            return {
                code: status.INTERNAL,
                res: null,
                message: "Internal server error",
            };
        }
    }

    async OAuth(body:SigninRequestSchemaType){
        try {
            const u = await dbService.createUser(body);
            return this.createSession(u);
        } catch (e) {
             if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002"
             ){
                return this.createSession(body);
             }
              return {
                code: status.INTERNAL,
                res: null,
                message: "Internal server error",
            }
        }
    }
    
    async GetUser(body:GetUserRequestSchemaType){
        try {
            const u = await dbService.findUniqueUserById(body.targetUserId,{password:false,createdAt:false,updatedAt:false});
            return {
                code:status.OK,
                message:"User found",
                res:u
            }
        } catch (e) {
            if(e instanceof PrismaClientKnownRequestError && e.code === "P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"Invalid user id"
                }
            }
            return {
                code:status.INTERNAL,
                res:null,
                message:"Internal server error"
            }
        }
    }

    async GetMe(userId:string){
        try {
            const u = await dbService.findUniqueUserById(userId,{createdAt:false,updatedAt:false})
            return {
                code:status.OK,
                res:u,
                message:"User found"
            }
        } catch (e) {
            if(e instanceof PrismaClientKnownRequestError && e.code === "P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"Invalid user id"
                }
            }
            return {
                code:status.INTERNAL,
                res:null,
                message:"Internal server error"
            }
        }
    }

    async refreshToken(body:RefreshTokenRequestSchemaType){
      try {
        return this.createSession(body.authUserData);
      } catch (error) {
        return {
            code:status.INTERNAL,
            message:"Internal server error",
            res:null
        }
      }
    }

    async createTeam({teamName,description,authUserData:{userId}}:CreateTeamRequestSchemaType){
        try {
            const team = await dbService.createTeam({teamName,description,userId});
            return {
                code:status.OK,
                message:"Team created",
                res:team
            }
        } catch (e) {
            return {
                code:status.INTERNAL,
                message:"Internal server error",
                res:null
            }
        }
    }

    async getTeam({teamId}:GetTeamRequestSchemaType){
        try {
            const t = await dbService.findUniqueTeamById(teamId);
            return {
                code:status.OK,
                res:t,
                message:"Team found"
            }
        } catch (e) {
            if(e instanceof PrismaClientKnownRequestError && e.code === "P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"Invalid team id"
                }
            }
            return {
                code:status.INTERNAL,
                res:null,
                message:"Internal server error"
            }
        }
    }

    async deleteTeam({teamId,authUserData:{userId}}:DeleteTeamRequestSchemaType){
       try {
          //check in cache first
          //cache code goes here

          const member = await dbService.findTeamMember({
            teamId,
            userId,
          })
          hasPermission("TEAM",member.role,"DELETE");
          const res = await dbService.deleteTeamById(teamId);
          return {
            code:status.OK,
            res,
            message:"Team deleted"
          }
       } catch (e:any) {
         if(e instanceof PrismaClientKnownRequestError){
            if((e.meta?.target as Array<string>).includes("TeamMember") && e.code=="P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"User is not a member"
                }
            }
            else if((e.meta?.target as Array<string>).includes("Team") && e.code=="P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"Team does not exists"
                }
            }
         }
         else if(e.message=="PERMISSIONS_NOT_FOUND"){
            return {
                code:status.PERMISSION_DENIED,
                message:"User is not admin",
                res:null
            }
         }
         return {
            code:status.INTERNAL,
            message:"Internal server error",
            res:null
         }
       }
    }

    async createTeamMemberInvitation({teamId,userId:targetUserId,role,authUserData:{userId}}:TeamMemberInvitationSchemaType){
        try {
            //cache code

           const member = await dbService.findTeamMember({
              userId,
              teamId
           })
           hasPermission("TEAM_MEMBER",member.role,"CREATE");
           const invitation = await dbService.createTeamInvitation({
            teamId,
            userId:targetUserId,
            role
           })
           return {
            code:status.OK,
            res:invitation,
            message:"Invitation created"
          }
       } catch (e:any) {
         if(e instanceof PrismaClientKnownRequestError){
            if((e.meta?.target as Array<string>).includes("TeamMember") && e.code=="P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"User is not a member"
                }
            }
            else if((e.meta?.target as Array<string>).includes("Team") && e.code=="P2025"){
                return {
                    code:status.NOT_FOUND,
                    res:null,
                    message:"Team does not exists"
                }
            }
         }
         else if(e.message=="PERMISSIONS_NOT_FOUND"){
            return {
                code:status.PERMISSION_DENIED,
                message:"User is not admin",
                res:null
            }
         }
         return {
            code:status.INTERNAL,
            message:"Internal server error",
            res:null
         }
       }
    }

    private createSession(u: any) {
        return {
            code: status.OK,
            res: {
                tokens: {
                    accessToken: createJwt(u),
                    refreshToken: createJwt(u, "7d"),
                },
            },
            message: "Session created",
        };
    }
}

export default AuthService;