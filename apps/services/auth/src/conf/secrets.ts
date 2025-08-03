import { configDotenv } from "dotenv"

configDotenv()
const SECRETS = {
    JWT_SECRET : String(process.env.JWT_SECRET)    
} as const

export default SECRETS