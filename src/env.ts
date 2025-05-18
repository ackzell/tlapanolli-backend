/* eslint-disable node/no-process-env */
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(8888),
  // PINO LOG LEVELS:
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line node/prefer-global/process
const { data, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error('❌ Invalid env:');
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));

  // eslint-disable-next-line node/prefer-global/process
  process.exit(1);
}

export const appEnv = data!;
