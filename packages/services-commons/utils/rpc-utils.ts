import { ZodObject, ZodType } from 'zod';

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