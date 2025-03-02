"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function seedData() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Session not found");
    }

    const currentUserId = session.user.id;
    const orgId = "VvnzALG4FnSfp0Q0qmk014B84SirDHP0";

    // 1. Create the organization
    // const orgData = await auth.api.createOrganization({
    //   headers: await headers(),
    //   body: {
    //     name: "Development Organization",
    //     slug: "dev-org",
    //   },
    // });

    // if (!orgData) {
    //   throw new Error("Organization creation failed");
    // }

    // const orgId = orgData.id;

    // 2. Create the admin user with better-auth
    // const adminUser = await auth.api.signUpEmail({
    //   body: {
    //     email: "admin@example.com",
    //     password: "password1234",
    //     name: "Admin User",
    //   },
    // });

    // if (!adminUser) {
    //   throw new Error(`Admin user creation failed`);
    // }


    // 3. Add the admin user to the organization as owner
    // await auth.api.addMember({
    //   body: {
    //     userId: currentUserId,
    //     organizationId: orgId,
    //     role: "owner",
    //   },
    // });

    // 4. Create the member user with better-auth
    // const memberUser = await auth.api.signUpEmail({
    //   body: {
    //     email: "member@example.com",
    //     password: "password1234",
    //     name: "Member User",
    //   },
    // });

    // if (!memberUser) {
    //   throw new Error(`Member user creation failed`);
    // }

    // const memberUserId = memberUser.user.id;

    // 5. Add the member user to the organization as member
    // await auth.api.addMember({
    //   body: {
    //     userId: currentUserId,
    //     organizationId: orgId,
    //     role: "member",
    //   },
    // });

    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
}

