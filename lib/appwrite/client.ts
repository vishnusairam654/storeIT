
import { Client, Account } from "appwrite";
import { appwriteConfig } from "./config";

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
