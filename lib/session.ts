"use server";

import { createSessionClient } from "@/lib/appwrite";

export async function validateSession(): Promise<boolean> {
  try {
    const { account } = await createSessionClient();
    await account.get();
    return true;
  } catch (error) {
    console.log("Session validation failed:", error);
    return false;
  }
}

export async function getSessionUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
