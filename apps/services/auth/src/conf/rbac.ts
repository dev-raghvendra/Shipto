import { RoleType, ScopeType } from "types";
import { PermissionType } from "@prisma/index";

type T_RBAC_CONFIG = {
    [scope in ScopeType]: {
        [role in RoleType]: {
            permissions: PermissionType[];
        };
    };
};

const RBAC_CONFIG: T_RBAC_CONFIG = {
    PROJECT: {
        OWNER: { permissions: ["CREATE", "DELETE", "READ", "UPDATE"] },
        ADMIN: { permissions: ["READ", "UPDATE"] },
        DEVELOPER: { permissions: ["READ", "UPDATE"] },
        VIEWER: { permissions: ["READ"] },
    },
    PROJECT_MEMBER: {
        OWNER: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] },
        ADMIN: { permissions: ["READ", "SELF_DELETE"] },
        DEVELOPER: { permissions: ["READ", "SELF_DELETE"] },
        VIEWER: { permissions: ["READ", "SELF_DELETE"] },
    },
    TEAM: {
        OWNER: { permissions: ["READ"] },
        ADMIN: { permissions: ["DELETE", "READ", "CREATE", "UPDATE"] },
        DEVELOPER: { permissions: ["READ"] },
        VIEWER: { permissions: ["READ"] },
    },
    TEAM_MEMBER: {
        OWNER: { permissions: ["READ"] },
        ADMIN: { permissions: ["DELETE", "READ", "CREATE", "UPDATE"] },
        DEVELOPER: { permissions: ["READ", "SELF_DELETE"] },
        VIEWER: { permissions: ["READ"] },
    },
    TEAM_LINK: {
        OWNER: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] },
        ADMIN: { permissions: ["READ"] },
        DEVELOPER: { permissions: ["READ"] },
        VIEWER: { permissions: ["READ"] },
    },
    DEPLOYMENT: {
        OWNER: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] },
        ADMIN: { permissions: ["CREATE", "READ", "UPDATE", "DELETE"] },
        DEVELOPER: { permissions: ["CREATE", "READ", "UPDATE"] },
        VIEWER: { permissions: ["READ"] },
    },
} as const;

export default RBAC_CONFIG;
