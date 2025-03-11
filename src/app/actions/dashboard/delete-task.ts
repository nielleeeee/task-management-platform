"use server";

import { dbPool } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface DeleteTaskProps {
  id: string;
}

export async function deleteTask({ id }: DeleteTaskProps) {
  try {
    await dbPool.delete(schema.task).where(eq(schema.task.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}