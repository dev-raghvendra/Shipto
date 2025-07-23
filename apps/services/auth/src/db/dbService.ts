import { Prisma, PrismaClient } from "@prisma/client";
import passHashMiddleware from "./middleware";
import { v4 as uuid } from "uuid";
import {
    EmailPassLoginBody,
    ProjectMemberInvitationBody,
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

    async createUser(body: UserBody) {
        try {
            const u = await this._client.user.create({
                data: {
                    userId: this._generateId("User"),
                    emailVerified: body.provider !== "EMAIL" && true,
                    ...body,
                },
            });
            return { code: 200, res: u, message: "User created" };
        } catch (error: any) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code == "P2002"
            ) {
                return {
                    code: 409,
                    res: null,
                    message: "An user already exists with the same email",
                };
            }
            return { code: 500, res: null, message: "Internal server error" };
        }
    }

    async getUser(body: EmailPassLoginBody) {
        try {
            const u = await this._client.user.findUniqueOrThrow({
                where: body,
            });
            return { code: 200, res: u, message: "User found" };
        } catch (error: any) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code == "P2025"
            ) {
                return { code: 404, res: null, message: "User not found" };
            }
            return { code: 500, res: null, message: "Internal server error" };
        }
    }

    async createTeam(body: TeamBody & { userId: string }) {
        try {
            const t = await this._client.team.create({
                data: {
                    teamId: this._generateId("Team"),
                    ...body,
                    teamMembers: {
                        create: [
                            {
                                memberId: this._generateId("Team"),
                                role: "ADMIN",
                                userId: body.userId,
                            },
                        ],
                    },
                },
            });
            return { code: 200, res: t, message: "Team created" };
        } catch (error) {
            return { code: 500, res: null, message: "Internal server error" };
        }
    }

    async createTeamInvitation(body: TeamMemberInvitationBody) {
        try {
            const i = await this._client.teamMemberInvitation.create({
                data: {
                    inviteId: this._generateId("TeamMemberInvitation"),
                    ...body,
                    status: "PENDING",
                },
            });
            return { code: 200, res: i, message: "Team Invitation created" };
        } catch (error) {
            return { code: 500, res: null, message: "Internal server error" };
        }
    }

    async createProjectInvitation(body: ProjectMemberInvitationBody) {
        try {
            const i = await this._client.projectMemberInvitation.create({
                data: {
                    inviteId: this._generateId("ProjectMemberInvitation"),
                    ...body,
                    status: "PENDING",
                },
            });
            return { code: 200, res: i, message: "Project Invitation created" };
        } catch (error) {
            return { code: 500, res: null, message: "Internal server error" };
        }
    }

    private _generateId(model: keyof typeof MODEL_MAP) {
        return `${MODEL_MAP[model]}-${uuid()}`;
    }
}

const dbService = new Database()
export default dbService;