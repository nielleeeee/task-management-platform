import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function isUserAuthorized() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { authorized: false, error: "Unauthorized" };
  }

  return { authorized: true, session };
}
