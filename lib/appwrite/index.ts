"use server";

import { Account, Avatars, Client, Databases, Storage, Users } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");

  if (!session || !session.value) {
    // console.warn("createSessionClient: No session cookie found");
    throw new Error("No session found");
  }

  // Debugging: Log session details (safely)
  console.log("createSessionClient: Session found. Length:", session.value.length, "Prefix:", session.value.substring(0, 5));

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

// Client for user authentication (login/signup) - no API key needed
export const createAuthClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  return {
    get account() {
      return new Account(client);
    },
  };
};

export const createAdminClient = async () => {
  // Validate configuration early to provide clearer errors when env vars are missing
  if (!appwriteConfig.endpointUrl || !/^https?:\/\//.test(appwriteConfig.endpointUrl)) {
    throw new Error(
      "Invalid Appwrite endpoint. Ensure NEXT_PUBLIC_APPWRITE_ENDPOINT is set and includes the protocol (e.g. https://fra.cloud.appwrite.io).",
    );
  }

  if (!appwriteConfig.projectId) {
    throw new Error("Missing Appwrite project id. Set NEXT_PUBLIC_APPWRITE_PROJECT in your environment.");
  }

  if (!appwriteConfig.secretKey) {
    throw new Error("Missing Appwrite admin API key. Set NEXT_APPWRITE_KEY in your environment for server-side admin operations.");
  }

  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
    get users() {
      return new Users(client);
    },
  };
};