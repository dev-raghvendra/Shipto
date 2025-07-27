import dbService from "db/dbService";
import { status } from "@grpc/grpc-js";
import { EmailPassLoginBody, UserBody } from "types";
import { Prisma } from "@prisma/index";
import { createJwt } from "libs/jwt";

class AuthService {
    async signIn(body: UserBody) {
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

    async login(body: EmailPassLoginBody) {
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

    async OAuth(body:UserBody){
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