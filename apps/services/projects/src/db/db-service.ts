import {PrismaClient} from "@prisma/client"
import { AuthServiceClient, CreateTeamRequest } from "@shipto/proto";

class Database {
    private _client : PrismaClient;
    constructor(){this._client = new PrismaClient}
     

    createProject(){
             
    }
}
