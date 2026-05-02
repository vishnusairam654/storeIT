"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Permission, Query, Role } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { InputFile } from "node-appwrite/file";
import { MAX_FILE_SIZE, TOTAL_STORAGE_SPACE } from "@/constants";
import { checkRateLimit } from "@/lib/ratelimit";
import { logAuditEvent } from "@/lib/audit";
import { redirect } from "next/navigation";

const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

const resolveOwnerId = (file: Models.Document) => {
  const owner = file.owner as unknown;
  if (typeof owner === "string") return owner;
  if (owner && typeof owner === "object" && "$id" in owner) {
    return (owner as { $id: string }).$id;
  }
  return "";
};

const assertOwner = (file: Models.Document, currentUser: Models.Document) => {
  const ownerId = resolveOwnerId(file);
  if (!ownerId || ownerId !== currentUser.$id) {
    throw new Error("Not authorized to modify this file.");
  }
};

const buildPermissions = (ownerAccountId: string, sharedAccountIds: string[] = []) => {
  return [
    Permission.read(Role.user(ownerAccountId)),
    Permission.write(Role.user(ownerAccountId)),
    ...sharedAccountIds.map((accountId) => Permission.read(Role.user(accountId))),
  ];
};

const resolveAccountsByEmail = async (emails: string[]) => {
  if (!emails.length) return [];
  const { databases } = await createAdminClient();
  const results = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", emails)]
  );
  return results.documents.map((doc) => ({
    email: (doc as Models.Document).email as string,
    accountId: (doc as Models.Document).accountId as string,
  }));
};

export const uploadFile = async ({
  file,
  path,
}: UploadFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated.");

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File exceeds the maximum allowed size.");
    }

    // Convert File to Buffer for node-appwrite
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create InputFile from buffer
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    // Upload file using SDK
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    // Create file document in database
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: currentUser.$id,
      accountId: currentUser.accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const permissions = buildPermissions(currentUser.accountId);

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument,
      permissions
    );

    logAuditEvent({
      action: "file.upload",
      actorId: currentUser.$id,
      targetId: newFile.$id,
    });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  const { databases } = await createSessionClient();

  try {
    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated.");

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    assertOwner(file, currentUser);

    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { name: newName }
    );

    logAuditEvent({
      action: "file.rename",
      actorId: currentUser.$id,
      targetId: fileId,
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated.");

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    assertOwner(file, currentUser);

    const resolved = await resolveAccountsByEmail(emails);
    const sharedAccountIds = resolved.map((item) => item.accountId).filter(Boolean);
    const allowedEmails = resolved.map((item) => item.email).filter(Boolean);
    const permissions = buildPermissions(currentUser.accountId, sharedAccountIds);

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { users: allowedEmails },
      permissions
    );

    logAuditEvent({
      action: "file.share",
      actorId: currentUser.$id,
      targetId: fileId,
      metadata: { sharedCount: sharedAccountIds.length },
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file users");
  }
};

export const createFileDocument = async ({
  bucketFileId,
  path,
}: CreateFileDocumentProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated.");

    const rate = checkRateLimit(`upload:${currentUser.$id}`, 60 * 1000, 20);
    if (!rate.allowed) {
      throw new Error(`Upload rate limit exceeded. Try again in ${Math.ceil(rate.retryAfterMs / 1000)}s.`);
    }

    const bucketFile = await storage.getFile(appwriteConfig.bucketId, bucketFileId);
    const fileType = getFileType(bucketFile.name);

    const fileDocument = {
      type: fileType.type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: fileType.extension,
      size: bucketFile.sizeOriginal,
      owner: currentUser.$id,
      accountId: currentUser.accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const permissions = buildPermissions(currentUser.accountId);

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument,
      permissions
    );

    logAuditEvent({
      action: "file.record.create",
      actorId: currentUser.$id,
      targetId: newFile.$id,
    });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to create file document");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated.");

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    assertOwner(file, currentUser);

    // Delete from database first
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    // Then delete from storage (handle case where file may not exist in storage)
    try {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    } catch {
      // Storage file may already be deleted or not exist - log but don't fail
      console.warn(`Storage file ${bucketFileId} not found, may already be deleted`);
    }

    logAuditEvent({
      action: "file.delete",
      actorId: currentUser.$id,
      targetId: fileId,
    });

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};

export async function getTotalSpaceUsed() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  try {
    const { databases } = await createSessionClient();
    
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])]
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: TOTAL_STORAGE_SPACE,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used");
  }
}
