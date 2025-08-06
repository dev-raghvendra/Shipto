import { status } from "@grpc/grpc-js";
import {GrpcResponse} from "./rpc-utils";

export class GrpcAppError  {
  public code: number;
  public res: any;
  public message: string;

  constructor(code: number, message: string, res: any = null) {

    this.code = code;
    this.res = res;
    this.message = message
  }
}


export function createGrpcErrorHandler({
  serviceName
}: {
  serviceName: string;
}) {
  return function handleError(error: GrpcAppError,origin: string) {
    if(error.code!==status.INTERNAL){
        return GrpcResponse.ERROR(error.code,error.message,error.res);
    }
    return GrpcResponse.INTERNAL("Unexpected error occurred",origin,serviceName,error);
  }
}
