import { configDotenv } from "dotenv"

configDotenv()
const SECRETS = {
    JWT_SECRET : String(process.env.JWT_SECRET) ,
    PORT:String(process.env.PORT),
    HOST:String(process.env.HOST)
} as const

export default SECRETS
