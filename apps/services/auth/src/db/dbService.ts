import { Prisma, PrismaClient } from "@prisma/client";
import passHashMiddleware from "./middleware";
import { v4 as uuid } from "uuid";
import {
    EmailPassLoginBody,
    GetTeamMemberRequestSchemaType,
    ProjectMemberInvitationBody,
    SigninRequestSchemaType,
    TeamBody,
    TeamMemberInvitationBody,
    UserBody,
} from "types";

const MODEL_MAP = {
    User: "user",
    Team: "team",
    TeamMember: "team-m",
    ProjectMember: "prj-m",
    TeamMemberInvitation: "team-invite",
    ProjectMemberInvitation: "prj-invite",
} as const;

class Database {
    private _client;

    constructor() {
        this._client = new PrismaClient();
        this._client.$use(passHashMiddleware);
    }



     createUser(body: SigninRequestSchemaType) {
        return  this._client.user.create({
                data: {
                    userId: this._generateId("User"),
                    ...body,
                },
                select:{
                    password:false
                }
            });
    }

     findUniqueUser(where:Prisma.UserWhereUniqueInput,select:Prisma.UserSelect) {
       return  this._client.user.findUniqueOrThrow({
                where,
                select
          })
     }

     findUniqueUserById(userId:string,select?:Prisma.UserSelect){
        return this._client.user.findUniqueOrThrow({where:{userId},select})
     }

     findUsers(where:Prisma.UserWhereInput,select:Prisma.UserSelect){
        return this._client.user.findMany({where,select});
     }


     createTeam(body: TeamBody & { userId: string }) {
        return  this._client.team.create({
                data: {
                    teamId: this._generateId("Team"),
                    ...body,
                    teamMembers: {
                        create: [
                            {
                                memberId: this._generateId("TeamMember"),
                                role: "ADMIN",
                                userId: body.userId,
                            },
                        ],
                    },
                },
      });
    }

     deleteTeamById(teamId:string){
        return this._client.team.delete({
            where:{
                teamId
            }
        })
     }
     findUniqueTeamById(teamId:string,select?:Prisma.TeamSelect){
         return this._client.team.findUniqueOrThrow({where:{teamId},select})
     }


     findTeamMember(where:Prisma.TeamMemberWhereInput,select?:Prisma.TeamMemberSelect){
         return this._client.teamMember.findFirstOrThrow({where,select})
     }

    
     createTeamInvitation(body: TeamMemberInvitationBody) {
        return  this._client.teamMemberInvitation.create({
                data: {
                    inviteId: this._generateId("TeamMemberInvitation"),
                    ...body,
                    status: "PENDING",
                },
            });
    }

     createProjectInvitation(body: ProjectMemberInvitationBody) {
        return  this._client.projectMemberInvitation.create({
                data: {
                    inviteId: this._generateId("ProjectMemberInvitation"),
                    ...body,
                    status: "PENDING",
                },
            });
    }

    private _generateId(model: keyof typeof MODEL_MAP) {
        return `${MODEL_MAP[model]}-${uuid()}`;
    }
}

const dbService = new Database()
export default dbService;