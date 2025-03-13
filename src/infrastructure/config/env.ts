import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  MONGO_URL: z
    .string()
    .default(
      'mongodb://admin:example@localhost:27017/oz-tech-test?authSource=admin',
    ),
  GOOGLE_API_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('🔴 Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
