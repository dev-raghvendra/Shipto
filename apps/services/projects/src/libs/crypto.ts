import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipto/services-commons";
import { CONFIG } from "config/config";
import {Worker} from  "worker_threads";

export function verifySignature(payload:string, signature:string){
    return new Promise((res,rej)=>{
        const fileName = CONFIG.ENV === "development" ? "worker.ts" : "worker.js"
        const worker = new Worker(__dirname + `/${fileName}`,{
            workerData:{
                payload,
                signature
            }
        })
        worker.on("message",(data)=>{
            if(data.valid){
                res(true);
            }else{
                rej(new GrpcAppError(status.INVALID_ARGUMENT,"Invalid signature provided"));
            }
        })
        worker.on("error",(err)=>{
            rej(new GrpcAppError(status.INTERNAL,"Internal server error"));
        })
    })
}