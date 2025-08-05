import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import dbService from "db/dbService";
import { CreateTeamLinkRequestBodyType, DeleteProjectMemberRequestBodyType, GetProjectMemberRequestBodyType, ProjectMemberInvitationRequestBodyType } from "types/project";
import { AcceptMemberInviteRequestBodyType, BodyLessRequest } from "types/utility";
import { Permission } from "utils/rbac-utils";
import AuthResponse from "utils/response";
import { HandleServiceErrors } from "utils/service-error";

class ProjectService {
    private _permissions : Permission
    constructor(){
      this._permissions = new Permission()
    }
    async createProjectMemberInvitation({authUserData:{userId},projectId,userId:targetUserId,role}:ProjectMemberInvitationRequestBodyType){
        try {
            await this._permissions.canInviteProjectMember(userId,projectId);
            const invitation = await dbService.createProjectInvitation({projectId,userId:targetUserId,role})
           return AuthResponse.OK(invitation,"Invitation created")
        } catch (e:any) {
         return HandleServiceErrors({details:e,RPC:"CREATE-PROJECT-MEMBER-INVITATION"},null,{PERMISSION_DENIED:"User is not  the owner of project"})
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId}}:AcceptMemberInviteRequestBodyType){
       try {
            const {expiresAt,role,projectId} = await dbService.findProjectInviteById(inviteId);
            if(expiresAt?.getMilliseconds() as number >= Date.now()){
                throw new PrismaClientKnownRequestError("BAD_REQUEST",{code:"400",clientVersion:""})
            }

            const member = await dbService.createProjectMember({
                userId,
                role,
                projectId
            })
    
        return AuthResponse.OK(member,"Project joined");
       }  
        catch (e) {
          return HandleServiceErrors({details:e,RPC:"ACCEPT-PROJECT-MEMBER-INVITATION"},null,{NOT_FOUND:"Invite not found",BAD_REQUEST:"Invite expired"});
       }
    }

    async getProjectMember({targetUserId,projectId,authUserData:{userId}}:GetProjectMemberRequestBodyType){
      try {
          await this._permissions.canReadProjectMember(userId,projectId,targetUserId);
          const member = await dbService.findUniqueProjectMember({userId_projectId:{userId:targetUserId,projectId}});
          return AuthResponse.OK(member,"Member found");
      } catch (e) {
          return HandleServiceErrors({details:e,RPC:"GET-PROJECT-MEMBER-INVITATION"},"User");
       }
    }

    async deleteProjectMember({targetUserId,projectId,authUserData:{userId}}:DeleteProjectMemberRequestBodyType){
      try {
          await this._permissions.canRemoveProjectMember(userId,projectId,targetUserId);
          const member = await dbService.deleteProjectMember({userId_projectId:{
            userId:targetUserId,
            projectId
          }})
          return AuthResponse.OK(member,"Member removed");
      } catch (e) {
          return HandleServiceErrors({details:e,RPC:"DELETE-PROJECT-MEMBER-INVITATION"},"User");
       }
    }

    async linkTeam({projectId,teamId, authUserData:{userId}}:CreateTeamLinkRequestBodyType){
      try {
        await this._permissions.canCreateTeamLink(userId,projectId);
        const link = await dbService.createTeamLink({data:{projectId,teamId}})
        return AuthResponse.OK(link,"Linked team");
      } catch (e) {
        return HandleServiceErrors({details:e,RPC:"LINK-TEAM"},"User",{ALREADY_EXISTS:"Team already linked"});
      }
    }

      async GetAllUserProjectIds({authUserData:{userId}}:BodyLessRequest){
        try {
            const res = await dbService.startTransaction(async(tx)=>{
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
            if(res.length) return AuthResponse.OK(res,"ProjectIds found");
            return AuthResponse.NOT_FOUND(null,"User's projectIds not found")
        } catch (e) {
            return HandleServiceErrors({e,details:"GET-ALL-USER-PROJECT-IDS"},"Project")          
        }
    }
}

export default ProjectService

