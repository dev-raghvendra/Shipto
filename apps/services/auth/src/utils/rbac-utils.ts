import { PermissionType } from "@prisma/index";
import RBAC_CONFIG from "conf/rbac";
import { RoleType, ScopeType } from "types";

export function hasPermission(scope:ScopeType,role:RoleType,permission:PermissionType){
    const has =  RBAC_CONFIG[scope][role].permissions.includes(permission);
    if(!has) throw new Error("PERMISSIONS_NOT_FOUND")
}