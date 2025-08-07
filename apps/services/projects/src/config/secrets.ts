export const SECRETS ={
    GITHUB_API_JWT_SECRET: String(process.env.GITHUB_API_JWT_SECRET),
    GITHUB_APP_CLIENT_ID: String(process.env.GITHUB_APP_CLIENT_ID),
} as const