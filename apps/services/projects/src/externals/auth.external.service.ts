import { status } from "@grpc/grpc-js";
import { GetAuthClient } from "@shipto/grpc-clients";
import { AuthServiceClient ,User, HasPermissionsRequest, BodyLessRequest} from "@shipto/proto";
import { GrpcAppError, promisifyGrpcCall } from "@shipto/services-commons";
import { UserType, ScopesType, PermissionsType } from "@shipto/types";

export class AuthExternalService {
    private _authService: AuthServiceClient;

    constructor() {
        this._authService = GetAuthClient();
    }

    async getPermissions({authUserData,permissions,scope,resourceId,errMsg}:{
        authUserData: UserType
        permissions: PermissionsType[],
        scope: ScopesType,
        resourceId: string,
        errMsg?: string
    }) {
        try {
            const req = new HasPermissionsRequest({
                authUserData: new User(authUserData),
                permissions,
                scope,
                resourceId,
            });
            const res = await promisifyGrpcCall(this._authService.HasPermissions,req,status.PERMISSION_DENIED)
            return res.res;
        } catch (e:any) {
            if (e.code === status.PERMISSION_DENIED){
                new GrpcAppError(status.PERMISSION_DENIED, errMsg || "You do not have permission to perform this action")
          }
          throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",e)
        }
    }

    async getUserProjectIds(authUserData: UserType) {
        try {
            const req = new BodyLessRequest({
            authUserData: new User(authUserData),
        });
        const res = await promisifyGrpcCall(this._authService.GetAllUserProjectIds, req, status.NOT_FOUND);
        return res.res;
        } catch (e:any) {
            if(e.code === status.NOT_FOUND){
                throw new GrpcAppError(status.NOT_FOUND, "No projects found for this user");
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", e);
        }
    }
}

const authExternalService = new AuthExternalService();
export default authExternalService;
