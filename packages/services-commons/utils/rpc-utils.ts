import { status } from "@grpc/grpc-js";
import { ZodObject, ZodType } from 'zod';
import { convertDatesToISO } from "./db-utils";
import logger from "../libs/winston";

export type RPC_SCHEMA_T<RPC_T extends string> = {
    [K in RPC_T]: {
        schema: ZodType,
        errMsg: string
    }
}

export function getERRMSG(schema: ZodObject<any>) {
    return `Request lacks any of them: (${schema.keyof().options.join(', ')})`
}

export function createRPCEntry<T extends ZodType>(schema: T) {
    return {
        schema,
        errMsg: getERRMSG(schema as any)
    }
}


export class GrpcResponse {
  static OK<T>(res: T, message = "Success") {
    convertDatesToISO.apply(res as Object);
    return { code: status.OK, res, message };
  }

  static ERROR(code: number, message: string, res: any = null) {
    return { code, res, message };
  }

  static INTERNAL(message = "Internal server error", serviceName: string, origin: string, error:any, res: any = null) {
    logger.error(`UNEXPECTED_ERROR_OCCURED_IN_${serviceName}_AT_${origin}: ${JSON.stringify(error, null, 2)}`);
    return this.ERROR(status.INTERNAL, message, res);
  }
}


export function promisifyGrpcCall<
  Fn extends (req: any, callback: (err: any, res: any) => void) => void
>(
  fn: Fn,
  req: Parameters<Fn>[0],
  errCode: number
): Promise<NonNullable<Parameters<Parameters<Fn>[1]>[1]>> {
  return new Promise((resolve, reject) => {
    fn(req, (err, res) => {
      if (err) return reject(err);
      if (!res?.res) return reject({ code: errCode });
      resolve(res.res);
    });
  });
}

