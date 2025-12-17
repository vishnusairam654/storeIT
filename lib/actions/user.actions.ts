"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
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
  try {
    const { account } = await createAdminClient();
    await account.createEmailToken(userId, email);
    console.log("OTP sent successfully to:", email);
    return userId;
  } catch (error) {
    console.error("Failed to send email OTP:", error);
    throw error;
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { accountId: null, error: "User with this email already exists." };
    }

    const { account, databases } = await createAdminClient();

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

    await sendEmailOTP({ userId: newUserId, email });

    console.log("Account created successfully, returning accountId:", newUserId);
    return parseStringify({ accountId: newUserId });
  } catch (error) {
    console.error("Failed to create account:", error);
    return {
      accountId: null,
      error: error instanceof Error ? error.message : "Failed to create account"
    };
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
    console.log("Verifying OTP for account:", accountId);

    // ✅ Use Appwrite SDK - it handles the API call properly
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    console.log("Session created successfully:", session.$id);

    // ✅ Set cookie with session ID
    (await cookies()).set("appwrite-session", session.$id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });

    // ✅ Set account ID cookie
    (await cookies()).set("appwrite-account-id", accountId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });

    console.log("Cookies set successfully");
    return parseStringify({ success: true });
  } catch (error) {
    console.error("Verify secret error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    // ✅ Get account ID from cookie instead of calling account.get()
    const accountIdCookie = (await cookies()).get("appwrite-account-id");

    if (!accountIdCookie || !accountIdCookie.value) {
      return null;
    }

    const { databases } = await createAdminClient();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountIdCookie.value)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log("Failed to get current user:", error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
    (await cookies()).delete("appwrite-account-id"); // ✅ Also delete account ID cookie
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

    if (!existingUser) {
      return { accountId: null, error: "User not found" };
    }

    if (!existingUser.accountId) {
      return { accountId: null, error: "User account is corrupted - missing accountId." };
    }

    await sendEmailOTP({ userId: existingUser.accountId, email });

    console.log("Sign-in successful, returning accountId:", existingUser.accountId);
    return parseStringify({ accountId: existingUser.accountId });
  } catch (error) {
    console.error("Failed to sign in user:", error);
    return {
      accountId: null,
      error: error instanceof Error ? error.message : "Failed to sign in"
    };
  }
};