import { Logger } from '@libs/logger';

// Configure the custom logger
const tags = {};
export const appLogger = new Logger({
  level: 'trace',
  tags,
  date: true,
  time: true,
  delta: true,
  caller: true,
});
