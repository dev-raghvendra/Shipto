import { Prisma, PrismaClient } from "@prisma/client";
import passHashMiddleware from "./middleware";
import { v4 as uuid } from "uuid";
import { SigninRequestBodyType } from "types/user";
import { CreateTeamRequestDBBodyType, DeleteTeamRequestDBBodyType, TeamMemberInvitationRequestDBBodyType } from "types/team";
import { ProjectMemberInvitationRequestDBBodyType } from "types/project";


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

    // --- User Methods ---
    createUser(body: SigninRequestBodyType) {
        return this._client.user.create({
            data: {
                userId: this._generateId("User"),
                ...body,
            },
            select: {
                password: false,
            },
        });
    }

    findUniqueUser(args: Prisma.UserFindUniqueOrThrowArgs) {
  return this._client.user.findUniqueOrThrow(args);
}

    findUniqueUserById(userId: string, select?: Prisma.UserSelect) {
        return this._client.user.findUniqueOrThrow({ where: { userId }, select });
    }

    findUsers(where: Prisma.UserWhereInput, select: Prisma.UserSelect) {
        return this._client.user.findMany({ where, select });
    }

    // --- Team Methods ---
    createTeam(body: CreateTeamRequestDBBodyType & { userId: string }) {
        return this._client.team.create({
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

    deleteTeamById({teamId}: DeleteTeamRequestDBBodyType) {
        return this._client.team.delete({
            where: {
                teamId,
            },
        });
    }

    findUniqueTeamById(teamId: string, select?: Prisma.TeamSelect) {
        return this._client.team.findUniqueOrThrow({ where: { teamId }, select });
    }

    // --- Team Member Methods ---
    createTeamMember(body: TeamMemberInvitationRequestDBBodyType) {
        return this._client.teamMember.create({
            data: {
                memberId: this._generateId("TeamMember"),
                ...body,
            },
        });
    }

    findTeamMember(where: Prisma.TeamMemberWhereInput, select?: Prisma.TeamMemberSelect) {
        return this._client.teamMember.findFirstOrThrow({ where, select });
    }

    // --- Project Member Methods ---
    createProjectMember(body: ProjectMemberInvitationRequestDBBodyType) {
        return this._client.projectMember.create({
            data: {
                memberId: this._generateId("ProjectMember"),
                ...body,
            },
        });
    }

    findProjectMember(where: Prisma.ProjectMemberWhereInput, select?: Prisma.ProjectMemberSelect) {
        return this._client.projectMember.findFirstOrThrow({ where, select });
    }

    // --- Team Invitation Methods ---
    createTeamInvitation(body: TeamMemberInvitationRequestDBBodyType) {
        return this._client.teamMemberInvitation.create({
            data: {
                inviteId: this._generateId("TeamMemberInvitation"),
                ...body
            },
        });
    }

    findTeamInviteById(inviteId: string) {
        return this._client.teamMemberInvitation.findUniqueOrThrow({ where: { inviteId } });
    }

    // --- Project Invitation Methods ---
    createProjectInvitation(body: ProjectMemberInvitationRequestDBBodyType) {
        return this._client.projectMemberInvitation.create({
            data: {
                inviteId: this._generateId("ProjectMemberInvitation"),
                ...body
            },
        });
    }

    findProjectInviteById(inviteId: string) {
        return this._client.projectMemberInvitation.findUniqueOrThrow({ where: { inviteId } });
    }

    findTeamlinks(args:Prisma.TeamLinkFindManyArgs){
        return this._client.teamLink.findMany(args)
    }

    // --- Utility ---
    private _generateId(model: keyof typeof MODEL_MAP) {
        return `${MODEL_MAP[model]}-${uuid()}`;
    }
}

const dbService = new Database();
export default dbService;