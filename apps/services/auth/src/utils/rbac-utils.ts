import { PermissionType } from "@prisma/index";
import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import RBAC_CONFIG from "conf/rbac";
import { RoleType, ScopeType } from "types";

export function hasPermission(scope:ScopeType,role:RoleType,permission:PermissionType){
    const has =  RBAC_CONFIG[scope][role].permissions.includes(permission);
    if(!has) throw new PrismaClientKnownRequestError("PERMISSIONS_NOT_FOUND",{code:"42501",clientVersion:"4"})
}