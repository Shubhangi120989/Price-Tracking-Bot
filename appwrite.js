import { Client,Databases } from "node-appwrite";

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_KEY);

export const databases=new Databases(client)