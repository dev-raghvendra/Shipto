export const SECRETS ={
    GITHUB_API_JWT_SECRET: String(process.env.GITHUB_API_JWT_SECRET),
    GITHUB_APP_ID: String(process.env.GITHUB_APP_ID),
} as const