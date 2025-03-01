import { XataClient } from "@/xata";

const apiKey = process.env.XATA_API_KEY;
const branch = process.env.XATA_BRANCH;

if (!apiKey) {
  throw new Error("XATA_API_KEY is not set in environment variables");
}

export const xata = new XataClient({ apiKey, branch });
