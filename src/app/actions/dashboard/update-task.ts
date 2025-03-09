"use server";

import { dbPool } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface UpdateTaskProps {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
}

export async function updateTask({
  id,
  title,
  description,
  assigneeId,
}: UpdateTaskProps) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const updatedTasks = await dbPool
      .update(schema.task)
      .set({
        title: title,
        description: description,
        assigneeId: assigneeId,
      })
      .where(eq(schema.task.id, id))
      .returning();

    return { success: true, data: updatedTasks[0] };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task", data: null };
  }
}
