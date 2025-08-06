import { GetAuthClient } from "@shipto/grpc-clients";
import { AuthServiceClient ,User, HasPermissionsRequest, BodyLessRequest} from "@shipto/proto";
import { UserType, ScopesType, PermissionsType } from "@shipto/types";

class AuthExternalService {
    private _authService: AuthServiceClient;

    constructor() {
        this._authService = GetAuthClient();
    }

    async getPermissions({authUserData,permissions,scope,resourceId}:{
        authUserData: UserType
        permissions: PermissionsType[],
        scope: ScopesType,
        resourceId: string
    }): Promise<string> {
       const req = new HasPermissionsRequest({
           authUserData: new User(authUserData),
           permissions,
           scope,
           resourceId,
       });
       return new Promise((resolve,reject)=>{
           this._authService.HasPermissions(req,(err,res)=>{
               if(err) return reject(err);
                if(!res?.res) return resolve("");
                resolve(res.message);
           });
       });
    }

    async getUserProjectIds(authUserData: UserType): Promise<string[]> {
        const req = new BodyLessRequest({
            authUserData: new User(authUserData),
        });
        return new Promise((resolve, reject) => {
            this._authService.GetAllUserProjectIds(req, (err, res) => {
                if (err) return reject(err);
                if (!res?.res) return resolve([]);
                resolve(res.res);
            });
        });
    }
}

const authExternalService = new AuthExternalService();
export default authExternalService;
