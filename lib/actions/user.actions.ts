"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Client, Account, Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ userId, email }: { userId: string, email: string }) => {
  const { account } = await createAdminClient();
  try {
    await account.createEmailToken(userId, email);
    return userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const { account, databases } = await createAdminClient();

  try {
    const newUser = await account.create(ID.unique(), email, "tempPassword123!", fullName);

    const newUserId = newUser.$id;

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId: newUserId,
      },
    );

    const accountId = await sendEmailOTP({ userId: newUserId, email });
    if (!accountId) throw new Error("Failed to send an OTP");

    return parseStringify({ accountId: newUserId });
  } catch (error) {
    // If account creation in appwrite fails, we don't proceed.
    // If db document creation fails, we should ideally delete the appwrite user.
    // For now, we'll just let the error propagate.
    handleError(error, "Failed to create account");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    // Use raw fetch to bypass SDK potential issues
    // Endpoint for OTP (Token) exchange is /account/sessions/token? Or just /account/sessions?
    // Error "Param email is not optional" suggests we hit email/password endpoint.
    // Let's try /account/sessions/email -> NO, that's for password.
    // Let's try /account/sessions/token (Exchange token for session)
    const response = await fetch(`${appwriteConfig.endpointUrl}/account/sessions/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': appwriteConfig.projectId,
      },
      body: JSON.stringify({
        userId: accountId,
        secret: password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const session = await response.json();

    console.log("[DEBUG] Raw Fetch Result Keys:", Object.keys(session));

    let secret = session.secret;

    if (!secret) {
      console.log("[DEBUG] Secret missing in body. Checking headers...");
      const setCookie = response.headers.get("set-cookie");
      console.log("[DEBUG] Set-Cookie Header:", setCookie);

      if (setCookie) {
        const match = setCookie.match(/appwrite-session=([^;]+)/);
        if (match) {
          secret = match[1];
          console.log("[DEBUG] Found secret in header!");
        }
      }
    }

    if (!secret) {
      // Only throw if strictly required, but for debugging let's log everything
      console.error("FATAL: Secret not found in body OR headers.");
      // Dump headers for debug
      response.headers.forEach((val, key) => console.log(`[HEADER] ${key}: ${val}`));

      throw new Error("Secret missing from raw API response");
    }

    // Force strict manual cookie setting on server first, although it fails usually
    (await cookies()).set("appwrite-session", secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false, // For localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // AND return it to client for fallback
    return parseStringify({ sessionId: session.$id, secret: secret });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }
  finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // Validate that accountId exists
      if (!existingUser.accountId) {
        throw new Error("User account is corrupted - missing accountId. Please contact support.");
      }
      await sendEmailOTP({ userId: existingUser.accountId, email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};
