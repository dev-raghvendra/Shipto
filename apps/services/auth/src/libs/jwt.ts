import SECRETS from "conf/secrets"
import jwt from "jsonwebtoken"

export function createJwt(payload : Object,expiry?:string | "1h" ){
    return jwt.sign({payload,expiry},SECRETS.JWT_SECRET);
}

export function verifyJwt(token:string){
    return jwt.verify(token,SECRETS.JWT_SECRET);
}