"use server";

import { headers } from "next/headers";
import { dbPool } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface CreateTaskProps {
  title: string;
  description: string | null;
  assigneeId: string | null;
}

export async function createTask({
  title,
  description,
  assigneeId,
}: CreateTaskProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const member = await dbPool
    .select()
    .from(schema.member)
    .where(eq(schema.member.userId, session.user.id));

  if (member.length === 0) {
    throw new Error("Member not found");
  }

  const memberId = member[0].id;
  const organizationId = member[0].organizationId;
  const taskId = uuidv4();

  try {
    const insertedTasks = await dbPool
      .insert(schema.task)
      .values({
        id: taskId,
        title,
        description,
        assigneeId,
        memberId,
        organizationId,
      })
      .returning();

    revalidatePath("/");

    if (insertedTasks.length > 0) {
      return { success: true, data: insertedTasks[0] };
    } else {
      return { success: false, error: "Failed to create task" };
    }
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}
