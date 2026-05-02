/**
 * Appwrite configuration
 * 
 * Note: In Next.js, environment variables prefixed with NEXT_PUBLIC_ are 
 * inlined at build time. They must be accessed directly (not via bracket notation)
 * for client-side code to work properly.
 */

/**
 * Appwrite configuration with direct env access for client-side compatibility
 */
export const appwriteConfig = {
  // Public configuration (accessible in browser)
  // These use direct access because Next.js replaces them at build time
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION || '',
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION || '',
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET || '',

  // Secret configuration (server-side only)
  secretKey: process.env.NEXT_APPWRITE_KEY || '',
} as const;

/**
 * Validate configuration on module load (server-side only)
 */
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  const missingVars: string[] = [];
  
  if (!appwriteConfig.endpointUrl) missingVars.push('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  if (!appwriteConfig.projectId) missingVars.push('NEXT_PUBLIC_APPWRITE_PROJECT');
  if (!appwriteConfig.databaseId) missingVars.push('NEXT_PUBLIC_APPWRITE_DATABASE');
  if (!appwriteConfig.usersCollectionId) missingVars.push('NEXT_PUBLIC_APPWRITE_USERS_COLLECTION');
  if (!appwriteConfig.filesCollectionId) missingVars.push('NEXT_PUBLIC_APPWRITE_FILES_COLLECTION');
  if (!appwriteConfig.bucketId) missingVars.push('NEXT_PUBLIC_APPWRITE_BUCKET');
  if (!appwriteConfig.secretKey) missingVars.push('NEXT_APPWRITE_KEY');
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
  } else {
    console.log('🔐 Appwrite configuration validated successfully');
    console.log(`📍 Endpoint: ${appwriteConfig.endpointUrl}`);
    console.log(`🎯 Project: ${appwriteConfig.projectId}`);
  }
}

/**
 * Type-safe configuration access
 */
export type AppwriteConfig = typeof appwriteConfig;