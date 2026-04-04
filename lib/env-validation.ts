export interface EnvVar {
  name: string;
  required: boolean;
  description?: string;
}

export const requiredEnvVars: EnvVar[] = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', required: false, description: 'Supabase project URL' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: false, description: 'Supabase anon key' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', required: false, description: 'Supabase service role key' },
  { name: 'ANTHROPIC_API_KEY', required: false, description: 'Anthropic API key for AI' },
  { name: 'CLOUDINARY_URL', required: false, description: 'Cloudinary URL for image hosting' },
];

export function validateEnvVars(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];
    
    if (envVar.required && !value) {
      missing.push(envVar.name);
    } else if (!value && envVar.name === 'ANTHROPIC_API_KEY') {
      warnings.push(`${envVar.name} not set - running in mock mode`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

export function logEnvValidation(): void {
  const result = validateEnvVars();
  
  console.log('=== Environment Validation ===');
  
  if (result.warnings.length > 0) {
    console.warn('Warnings:');
    result.warnings.forEach(w => console.warn(`  - ${w}`));
  }
  
  if (!result.valid) {
    console.error('Missing required environment variables:');
    result.missing.forEach(m => console.error(`  - ${m}`));
  } else {
    console.log('All required environment variables are set.');
  }
  
  console.log('================================');
}
