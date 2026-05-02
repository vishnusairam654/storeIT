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
  console.error(message, error);
  throw error;
};

// ==================== EMAIL OTP AUTHENTICATION ====================

export const sendEmailOTP = async ({ email }: { email: string }) => {
  try {
    const { account } = await createAdminClient();

    console.log("📧 Sending OTP to:", email);
    const session = await account.createEmailToken(ID.unique(), email);
    console.log("✅ OTP sent successfully, userId:", session.userId);

    return session.userId;
  } catch (error) {
    console.error("❌ Failed to send email OTP:", error);
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
  try {
    const existingUser = await getUserByEmail(email);

    console.log("🔄 Creating account for:", email);
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingUser) {
      const { databases } = await createAdminClient();

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar: avatarPlaceholderUrl,
          accountId,
        },
      );
      console.log("✅ User document created for:", email);
    }

    return parseStringify({ accountId });
  } catch (error) {
    console.error("❌ Failed to create account:", error);
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
    const { account } = await createAdminClient();

    console.log("🔄 Verifying OTP for account:", accountId);
    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("✅ OTP verified, session created");
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.error("❌ Failed to verify OTP:", error);
    handleError(error, "Failed to verify OTP");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    console.error("❌ Failed to sign in user:", error);
    handleError(error, "Failed to sign in user");
  }
};

// ==================== SESSION MANAGEMENT ====================

export const getCurrentUser = async () => {
  try {
    const { account, databases } = await createSessionClient();
    const accountInfo = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountInfo.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log("getCurrentUser failed:", error);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch (error) {
    console.log("Session deletion failed:", error);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("appwrite-session");
  }

  redirect("/sign-in");
};