import {Prisma} from "@prisma/index"
import { genSalt, hash } from "bcrypt";

const passHashMiddleware : Prisma.Middleware = async(params,next)=>{
    if(params.model=="User" && params.action=="create" || params.action=="update" || params.action=="upsert"){
       const salt =  await genSalt(10);
       const hashedPass = await hash(params.args.data.password,salt);
       params.args.data.password = hashedPass;
    }
    return next(params);
}

export default passHashMiddleware;