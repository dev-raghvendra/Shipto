import { SECRETS } from 'config/secrets';
import jwt from 'jsonwebtoken';

export function createGithubJwt(expiry?:string | "5m"){
    return jwt.sign({expiry},SECRETS.GITHUB_API_JWT_SECRET,{
        issuer: SECRETS.GITHUB_APP_ID,
        algorithm: "RS256"
    });
}
