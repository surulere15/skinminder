import { logEnvValidation, validateEnvVars } from './env-validation';

logEnvValidation();

if (process.env.NODE_ENV === 'production') {
  const result = validateEnvVars();
  if (!result.valid) {
    throw new Error(`Missing required environment variables: ${result.missing.join(', ')}`);
  }
}
