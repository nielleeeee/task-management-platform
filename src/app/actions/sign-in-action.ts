"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export const signInAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const signInCredentials = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return signInCredentials;
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status);
    }
  }
};
