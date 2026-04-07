/**
 * Environment variable validation for production readiness.
 * Ensures the app doesn't crash in production due to missing configs.
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
];

export function validateEnv() {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
        isProd: process.env.NODE_ENV === 'production',
    };
}

export const env = validateEnv();
