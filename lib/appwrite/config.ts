/**
 * Utility to get and validate environment variables
 */
const getEnvVar = (key: string, isSecret: boolean = false): string => {
  const value = process.env[key];

  if (!value) {
    const errorMsg = `Missing required environment variable: ${key}`;
    console.error(errorMsg);

    // In development, provide helpful error message
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `${errorMsg}\n\nPlease add this to your .env.local file:\n${key}=your-value-here`
      );
    }

    throw new Error(errorMsg);
  }

  // Validate format for specific variables
  if (key.includes('ENDPOINT') && !value.startsWith('http')) {
    throw new Error(`${key} must be a valid URL starting with http:// or https://`);
  }

  if (isSecret && process.env.NODE_ENV === 'development') {
    console.log(`✓ ${key} loaded (${value.substring(0, 10)}...)`);
  }

  return value;
};

/**
 * Appwrite configuration with validation
 */
export const appwriteConfig = {
  // Public configuration (accessible in browser)
  endpointUrl: getEnvVar('NEXT_PUBLIC_APPWRITE_ENDPOINT'),
  projectId: getEnvVar('NEXT_PUBLIC_APPWRITE_PROJECT'),
  databaseId: getEnvVar('NEXT_PUBLIC_APPWRITE_DATABASE'),
  usersCollectionId: getEnvVar('NEXT_PUBLIC_APPWRITE_USERS_COLLECTION'),
  filesCollectionId: getEnvVar('NEXT_PUBLIC_APPWRITE_FILES_COLLECTION'),
  bucketId: getEnvVar('NEXT_PUBLIC_APPWRITE_BUCKET'),

  // Secret configuration (server-side only)
  secretKey: getEnvVar('NEXT_APPWRITE_KEY', true),
} as const;

/**
 * Validate configuration on module load (server-side only)
 */
if (typeof window === 'undefined') {
  console.log('🔐 Appwrite configuration validated successfully');
  console.log(`📍 Endpoint: ${appwriteConfig.endpointUrl}`);
  console.log(`🎯 Project: ${appwriteConfig.projectId}`);
  console.log(`💾 Database: ${appwriteConfig.databaseId}`);
  console.log(`🪣 Bucket: ${appwriteConfig.bucketId}`);
}

/**
 * Type-safe configuration access
 */
export type AppwriteConfig = typeof appwriteConfig;