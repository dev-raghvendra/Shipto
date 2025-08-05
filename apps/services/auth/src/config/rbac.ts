import { ScopeType } from "types/user";
import { TeamRoleType } from "types/team";
import { ProjectRoleType } from "types/project";
import { PermissionType } from "@prisma/index";


type T_RBAC_CONFIG = {
    [role in ProjectRoleType | TeamRoleType ]: {
        [scope in ScopeType]: {
            permissions: PermissionType[];
        };
    };
};

const RBAC_CONFIG: T_RBAC_CONFIG = {
    PROJECT_OWNER: {
        PROJECT: { permissions: ["CREATE", "DELETE", "READ", "UPDATE","TRANSFER_OWNERSHIP"] },
        PROJECT_MEMBER: { permissions: ["READ", "CREATE", "DELETE", "UPDATE", "SELF_UPDATE", "SELF_DELETE"] },
        TEAM: { permissions: ["READ"] },
        TEAM_MEMBER: { permissions: ["READ"] },
        TEAM_LINK: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] },
        DEPLOYMENT: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] }
    },
    PROJECT_ADMIN: {
        PROJECT: { permissions: ["READ", "UPDATE"] },
        PROJECT_MEMBER: { permissions: ["READ", "SELF_DELETE", "SELF_UPDATE", "UPDATE", "CREATE", "DELETE"] },
        TEAM: { permissions: ["READ"] },
        TEAM_MEMBER: { permissions: ["READ"] },
        TEAM_LINK: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] },
        DEPLOYMENT: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] }
    },
    PROJECT_DEVELOPER: {
        PROJECT: { permissions: ["READ", "UPDATE"] },
        PROJECT_MEMBER: { permissions: ["READ", "SELF_DELETE"] },
        TEAM: { permissions: ["READ"] },
        TEAM_MEMBER: { permissions: ["READ"] },
        TEAM_LINK: { permissions: ["READ"] },
        DEPLOYMENT: { permissions: ["READ", "CREATE", "UPDATE"] }
    },
    PROJECT_VIEWER: {
        PROJECT: { permissions: ["READ"] },
        PROJECT_MEMBER: { permissions: ["READ"] },
        TEAM: { permissions: ["READ"] },
        TEAM_MEMBER: { permissions: ["READ"] },
        TEAM_LINK: { permissions: ["READ"] },
        DEPLOYMENT: { permissions: ["READ"] }
    },
    
    TEAM_OWNER: {
        PROJECT: { permissions: ["READ", "UPDATE"] },
        PROJECT_MEMBER: { permissions: ["READ"] },
        TEAM: { permissions: ["READ", "CREATE", "DELETE", "UPDATE", "TRANSFER_OWNERSHIP"] },
        TEAM_MEMBER: { permissions: ["READ", "CREATE", "DELETE", "UPDATE", "SELF_DELETE", "SELF_UPDATE"] },
        TEAM_LINK: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] },
        DEPLOYMENT: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] }
    },
    TEAM_ADMIN: {
        PROJECT: { permissions: ["READ", "UPDATE"] },
        PROJECT_MEMBER: { permissions: ["READ"] },
        TEAM: { permissions: ["READ", "CREATE", "UPDATE"] },
        TEAM_MEMBER: { permissions: ["READ", "CREATE", "DELETE", "UPDATE", "SELF_DELETE", "SELF_UPDATE"] },
        TEAM_LINK: { permissions: ["READ", "DELETE"] },
        DEPLOYMENT: { permissions: ["READ", "CREATE", "DELETE", "UPDATE"] }
    },
    TEAM_DEVELOPER: {
        PROJECT: { permissions: ["READ", "UPDATE"] },
        PROJECT_MEMBER: { permissions: ["READ"] },
        TEAM: { permissions: ["READ"] },
        TEAM_MEMBER: { permissions: ["READ", "SELF_DELETE"] },
        TEAM_LINK: { permissions: ["READ"] },
        DEPLOYMENT: { permissions: ["READ", "CREATE", "UPDATE"] }
    },
    TEAM_VIEWER: {
        PROJECT: { permissions: ["READ"] },
        PROJECT_MEMBER: { permissions: ["READ"] },
        TEAM: { permissions: ["READ"] },
        TEAM_MEMBER: { permissions: ["READ"] },
        TEAM_LINK: { permissions: ["READ"] },
        DEPLOYMENT: { permissions: ["READ"] }
    }
} as const;

export default RBAC_CONFIG;
