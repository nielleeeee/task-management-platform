"use server";

import { dbPool } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TaskStatus } from "../../../../types";

interface UpdateTaskStatusProps {
  id: string;
  status: TaskStatus;
}

export async function updateTaskStatus({ id, status }: UpdateTaskStatusProps) {
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
        status: status,
      })
      .where(eq(schema.task.id, id))
      .returning();

    return { success: true, data: updatedTasks[0] };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task", data: null };
  }
}
