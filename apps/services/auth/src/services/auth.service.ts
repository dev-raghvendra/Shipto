import dbService from "db/dbService";
import { AcceptMemberInviteSchemaType, CreateTeamRequestSchemaType, DeleteTeamRequestSchemaType, EmailPassLoginSchemaType, GetTeamRequestSchemaType, GetUserRequestSchemaType, ProjectMemberInvitationSchemaType, RefreshTokenRequestSchemaType, RoleType, SigninRequestSchemaType, TeamMemberInvitationRolesType, TeamMemberInvitationSchemaType } from "types";
import { createJwt } from "libs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import { hasPermission } from "utils/rbac-utils";
import AuthResponse from "utils/response";
import { compare } from "libs/bcrypt";
import { HandleServiceErrors } from "utils/service-error";

class AuthService {
    async signIn(body: SigninRequestSchemaType) {
        try {
            const u = await dbService.createUser(body);
            return this.createSession(u);
        } catch (e) {
            return HandleServiceErrors(e,null,{ALREADY_EXISTS:"User already exists with provided email"});
        }
    }

    async login(body: EmailPassLoginSchemaType) {
        try {
            const u = await dbService.findUniqueUser({email:body.email}, {createdAt:false,updatedAt:false,_count:false });
            const isVerified = await compare(body.password,u.password)
            if(!isVerified) throw new PrismaClientKnownRequestError("Invalid pass",{code:"P2025",clientVersion:"4"})
            const {password, ...user} = u;
            return this.createSession(user);
        } catch (e) {
            return HandleServiceErrors(e,null,{NOT_FOUND:"Invalid credentials"});
        }
    }

    async OAuth(body:SigninRequestSchemaType){
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
    
    async GetUser(body:GetUserRequestSchemaType){
        try {
            const u = await dbService.findUniqueUserById(body.targetUserId,{password:false,createdAt:false,updatedAt:false});
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

    async refreshToken(body:RefreshTokenRequestSchemaType){
      try {
        return this.createSession(body.authUserData);
      } catch (error) {
        return AuthResponse.INTERNAL()
      }
    }

    async createTeam({teamName,description,authUserData:{userId}}:CreateTeamRequestSchemaType){
        try {
            const team = await dbService.createTeam({teamName,description,userId});
            return AuthResponse.OK(team,"Team created")
        } catch (e) {
            return AuthResponse.INTERNAL()
        }
    }

    async getTeam({teamId}:GetTeamRequestSchemaType){
        try {
            const t = await dbService.findUniqueTeamById(teamId);
            return AuthResponse.OK(t,"Team found");
        } catch (e) {
            return HandleServiceErrors(e,"Team")
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
          return AuthResponse.OK(res,"Team deleted");
       } catch (e:any) {
         return HandleServiceErrors(e,null,{PERMISSION_DENIED:"User is not  the admin of team",NOT_FOUND:"Memeber not found"})
       }
    }

    async createTeamMemberInvitation({teamId,userId:targetUserId,role,authUserData:{userId}}:TeamMemberInvitationSchemaType){
        try {
            //cache code

           const member = await dbService.findTeamMember({userId,teamId})
           hasPermission("TEAM_MEMBER",member.role,"CREATE");
           const invitation = await dbService.createTeamInvitation({teamId,userId:targetUserId,role})
           return AuthResponse.OK(invitation,"Invitation created")
       } catch (e:any) {
         return HandleServiceErrors(e,null,{PERMISSION_DENIED:"User is not  the admin of team",NOT_FOUND:"Member not found"})
       }
    }

    async createProjectMemeberInvitation({authUserData:{userId},projectId,userId:targetUserId,role}:ProjectMemberInvitationSchemaType){
        // cache code
        try {
            const member = await dbService.findProjectMember({userId,projectId})
            hasPermission("PROJECT_MEMBER",member.role,"CREATE");
            const invitation = await dbService.createProjectInvitation({projectId,userId:targetUserId,role})
           return AuthResponse.OK(invitation,"Invitation created")
        } catch (e:any) {
         return HandleServiceErrors(e,null,{PERMISSION_DENIED:"User is not  the owner of project",NOT_FOUND:"Member not found"})
       }
    }

    async acceptInvitation<t extends "Team" | "Project">(type:t,{inviteId,authUserData:{userId}}:AcceptMemberInviteSchemaType){
       try {
         let member;
        if(type=="Team"){
            const invite = await dbService.getTeamInviteById(inviteId);
            
            member = await dbService.createTeamMember({
                userId,
                role:invite.role as TeamMemberInvitationRolesType,
                teamId:invite.teamId
            })
        }
        else{
             const invite = await dbService.getProjectInviteById(inviteId);
            
            member = await dbService.createProjectMember({
                userId,
                role:invite.role as TeamMemberInvitationRolesType,
                projectId:invite.projectId
            })
        }
        return AuthResponse.OK(member,"Team joined");
       } catch (e) {
          return HandleServiceErrors(e,null,{NOT_FOUND:"Invite not found"});
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