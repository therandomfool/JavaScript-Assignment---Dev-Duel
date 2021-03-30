import Joi from 'joi'

// import and configure dotenv, will load vars in .env in PROCESS.ENV
import dotenv from 'dotenv'

const nodeEnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production'])
    .default('development')
})

// define validation for all the env vars
const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000)
})
  .unknown()
  .required()

// Determine environment
dotenv.config({ path: 'server' })
let { value: nodeEnv } = Joi.validate(process.env, nodeEnvSchema)

// Load specified environment variables
dotenv.config({ path: `server/.env-${nodeEnv.NODE_ENV}` })
let { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const index = {
  env: envVars.NODE_ENV,
  port: envVars.PORT
}

export default index
