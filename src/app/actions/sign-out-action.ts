"use server"

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    redirect("/");
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status);
    }
  }
};
