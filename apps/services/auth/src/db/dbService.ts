import { Prisma, PrismaClient } from "@prisma/client";
import passHashMiddleware from "./middleware";
import { SigninRequestBodyType } from "types/user";
import { CreateTeamRequestDBBodyType, DeleteTeamRequestDBBodyType, TeamMemberInvitationRequestDBBodyType } from "types/team";
import { ProjectMemberInvitationRequestDBBodyType } from "types/project";
import { generateId } from "@shipto/services-commons";


const MODEL_MAP = {
    User: "user",
    Team: "team",
    TeamMemberInvitation: "team-invite",
    ProjectMemberInvitation: "prj-invite",
} as const;

class Database {
    private _client;

    constructor() {
        this._client = new PrismaClient();
        this._client.$use(passHashMiddleware);
    }

    createUser(body: SigninRequestBodyType) {
        return this._client.user.create({
            data: {
                userId: generateId("User",MODEL_MAP),
                ...body,
            },
            select: {
                userId:true,
               avatarUri:true,
               fullName:true,
               email:true,
               emailVerified:true,
               createdAt:true,
               provider:true,
               updatedAt:true
            },
        });
    }

    findUniqueUser(args: Prisma.UserFindUniqueOrThrowArgs) {
     return this._client.user.findUniqueOrThrow(args);
    }

    findUsers(where: Prisma.UserWhereInput, select: Prisma.UserSelect) {
        return this._client.user.findMany({ where, select });
    }

    findUniqueUserById(userId: string, select?: Prisma.UserSelect) {
        return this._client.user.findUniqueOrThrow({ where: { userId }, select });
    }

    createTeam(body: CreateTeamRequestDBBodyType & { userId: string }) {
        return this._client.team.create({
            data: {
                teamId: generateId("Team",MODEL_MAP),
                ...body,
                teamMembers: {
                    create: [
                        {
                            role: "TEAM_ADMIN",
                            userId: body.userId,
                        },
                    ],
                },
            },
        });
    }
    
    findUniqueTeamById(teamId: string, select?: Prisma.TeamSelect) {
        return this._client.team.findUniqueOrThrow({ where: { teamId }, select });
    }

    deleteTeamById({teamId}: DeleteTeamRequestDBBodyType) {
        return this._client.team.delete({
            where: {
                teamId,
            },
        });
    }

    createTeamMember(body: TeamMemberInvitationRequestDBBodyType) {
        return this._client.teamMember.create({
            data: {
                ...body,
            },
        });
    }

    findUniqueTeamMember(where: Prisma.TeamMemberWhereUniqueInput, select?: Prisma.TeamMemberSelect) {
        return this._client.teamMember.findUniqueOrThrow({ where, select });
    }

    findTeamMembers(where: Prisma.TeamMemberWhereInput, select?: Prisma.TeamMemberSelect){
        return this._client.teamMember.findMany({where,select})
    }
    
    deleteTeamMember(where: Prisma.TeamMemberWhereUniqueInput, select?: Prisma.TeamMemberSelect){
        return this._client.teamMember.delete({where,select})
    }

    createProjectMember(body: ProjectMemberInvitationRequestDBBodyType) {
        return this._client.projectMember.create({
            data: {
                ...body,
            },
        });
    }

    findUniqueProjectMember(where: Prisma.ProjectMemberWhereUniqueInput, select?: Prisma.ProjectMemberSelect) {
        return this._client.projectMember.findUniqueOrThrow({ where, select });
    }

    findProjectMembers(where: Prisma.ProjectMemberWhereInput, select?: Prisma.ProjectMemberSelect){
        return this._client.projectMember.findMany({where,select})
    }
    
    deleteProjectMember(where: Prisma.ProjectMemberWhereUniqueInput, select?: Prisma.ProjectMemberSelect){
        return this._client.projectMember.delete({where,select})
    }

    createTeamInvitation(body: TeamMemberInvitationRequestDBBodyType) {
        return this._client.teamMemberInvitation.create({
            data: {
                inviteId: generateId("TeamMemberInvitation",MODEL_MAP),
                ...body
            },
        });
    }

    findTeamInviteById(inviteId: string) {
        return this._client.teamMemberInvitation.findUniqueOrThrow({ where: { inviteId } });
    }

    createProjectInvitation(body: ProjectMemberInvitationRequestDBBodyType) {
        return this._client.projectMemberInvitation.create({
            data: {
                inviteId: generateId("ProjectMemberInvitation",MODEL_MAP),
                ...body
            },
        });
    }

    findProjectInviteById(inviteId: string) {
        return this._client.projectMemberInvitation.findUniqueOrThrow({ where: { inviteId } });
    }

    findTeamLinks(args:Prisma.TeamLinkFindManyArgs){
        return this._client.teamLink.findMany(args)
    }

    createTeamLink(args:Prisma.TeamLinkCreateArgs){
        return this._client.teamLink.create(args)
    }
}

const dbService = new Database();
export default dbService;