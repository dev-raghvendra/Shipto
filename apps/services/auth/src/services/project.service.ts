import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import { BodyLessRequestBodyType } from "@shipto/types";
import  { Database, dbService } from "db/db-service";
import { CreateTeamLinkRequestBodyType, DeleteProjectMemberRequestBodyType, GetProjectMemberRequestBodyType, ProjectMemberInvitationRequestBodyType } from "types/project";
import { AcceptMemberInviteRequestBodyType } from "types/utility";
import { Permission } from "utils/rbac-utils";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipto/services-commons";
import { status } from "@grpc/grpc-js";


class ProjectService {
    private _permissions : Permission
    private _dbService : Database;
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>
    constructor(){
      this._permissions = new Permission()
      this._dbService = dbService;
      this._errorHandler = createGrpcErrorHandler({serviceName:"AUTH_SERVICE"});
    }
    async createProjectMemberInvitation({authUserData:{userId},projectId,userId:targetUserId,role}:ProjectMemberInvitationRequestBodyType){
        try {
            await this._permissions.canInviteProjectMember(userId,projectId);
            const invitation = await this._dbService.createProjectInvitation({projectId,userId:targetUserId,role})
           return GrpcResponse.OK(invitation,"Invitation created")
        } catch (e:any) {
         return this._errorHandler(e,"CREATE-PROJECT-MEMBER-INVITATION")
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId}}:AcceptMemberInviteRequestBodyType){
       try {
            const {expiresAt,role,projectId} = await this._dbService.findProjectInviteById(inviteId);
            if(expiresAt?.getMilliseconds() as number >= Date.now()){
                throw new GrpcAppError(status.INVALID_ARGUMENT,"Invite expired",null);
            }
            const member = await this._dbService.createProjectMember({
                userId,
                role,
                projectId
            })
    
        return GrpcResponse.OK(member,"Project joined");
       }  
        catch (e:any) {
          return this._errorHandler(e,"ACCEPT-PROJECT-MEMBER-INVITATION");
       }
    }

    async getProjectMember({targetUserId,projectId,authUserData:{userId}}:GetProjectMemberRequestBodyType){
      try {
          await this._permissions.canReadProjectMember(userId,projectId,targetUserId);
          const member = await this._dbService.findUniqueProjectMember({userId_projectId:{userId:targetUserId,projectId}});
          return GrpcResponse.OK(member,"Member found");
      } catch (e:any) {
          return this._errorHandler(e,"GET-PROJECT-MEMBER-INVITATION");
       }
    }

    async deleteProjectMember({targetUserId,projectId,authUserData:{userId}}:DeleteProjectMemberRequestBodyType){
      try {
          await this._permissions.canRemoveProjectMember(userId,projectId,targetUserId);
          const member = await this._dbService.deleteProjectMember({userId_projectId:{
            userId:targetUserId,
            projectId
          }})
          return GrpcResponse.OK(member,"Member removed");
      } catch (e:any) {
          return this._errorHandler(e,"DELETE-PROJECT-MEMBER-INVITATION");
       }
    }

    async linkTeam({projectId,teamId, authUserData:{userId}}:CreateTeamLinkRequestBodyType){
      try {
        await this._permissions.canCreateTeamLink(userId,projectId);
        const link = await this._dbService.createTeamLink({data:{projectId,teamId}})
        return GrpcResponse.OK(link,"Linked team");
      } catch (e:any) {
        return this._errorHandler(e,"LINK-TEAM");
      }
    }

      async GetAllUserProjectIds({authUserData:{userId}}:BodyLessRequestBodyType){
        try {
            const res = await this._dbService.startTransaction(async(tx)=>{
                const teamProjects = await tx.team.findMany({
                    where:{
                        teamMembers:{
                            some:{
                                userId
                            }
                        },
                        teamLink:{
                            some:{}
                        }
                    },
                    select:{
                        teamLink:{
                            select:{
                                projectId:true
                            }
                        }
                    }
                })
                const allProjectIdsViaTeam = teamProjects.flatMap(tm=>tm.teamLink.map(ln=>ln.projectId));
                const uniqueProjectIds = [...new Set(allProjectIdsViaTeam)];
                const directProjects = await tx.projectMember.findMany({
                    where:{
                        userId,
                        projectId:{
                            notIn:uniqueProjectIds
                        }
                    },
                    select:{
                        projectId:true
                    }
                })
                const finalIds =  [...uniqueProjectIds,...directProjects.map(p=>p.projectId)];
                return finalIds
            }) as string[]
            if(res.length) return GrpcResponse.OK(res,"ProjectIds found");
            throw new GrpcAppError(status.NOT_FOUND,"No projects found for user",null);
        } catch (e:any) {
            return this._errorHandler(e,"GET-ALL-USER-PROJECT-IDS");
        }
    }
}

export default ProjectService
