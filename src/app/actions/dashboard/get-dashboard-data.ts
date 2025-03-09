"use server";

import { dbPool } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, aliasedTable } from "drizzle-orm";
import { isUserAuthorized } from "@/lib/auth-helper";

export async function fetchDashboardData() {
  try {
    const userAuth = await isUserAuthorized();

    if (!userAuth.authorized || !userAuth.session) {
      return { status: "unauthorized", error: userAuth.error };
    }

    const { session } = userAuth;

    // Get the member record for the logged-in user
    const member = await dbPool
      .select({ organizationId: schema.member.organizationId })
      .from(schema.member)
      .where(eq(schema.member.userId, session.user.id))
      .limit(1);

    if (!member || member.length === 0) {
      return { status: "member_not_found", error: "Member not found" };
    }

    const organizationId = member[0].organizationId;

    // Create aliased member table
    const assigneeMember = aliasedTable(schema.member, "assigneeMember");

    // Fetch all tasks for the organization
    const organizationTasks = await dbPool
      .select({
        id: schema.task.id,
        title: schema.task.title,
        description: schema.task.description,
        status: schema.task.status,
        assigneeId: schema.task.assigneeId,
        assigneeName: schema.user.name,
        memberId: schema.task.memberId,
        organizationId: schema.task.organizationId,
      })
      .from(schema.task)
      .innerJoin(schema.member, eq(schema.task.memberId, schema.member.id))
      .leftJoin(assigneeMember, eq(schema.task.assigneeId, assigneeMember.id))
      .leftJoin(schema.user, eq(assigneeMember.userId, schema.user.id))
      .where(eq(schema.task.organizationId, organizationId));

    // Fetch all members of the organization
    const organizationMembers = await dbPool
      .select({ id: schema.member.id, name: schema.user.name })
      .from(schema.member)
      .innerJoin(schema.user, eq(schema.member.userId, schema.user.id))
      .where(eq(schema.member.organizationId, organizationId));

    return {
      status: "success",
      tasks: organizationTasks,
      members: organizationMembers,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      status: "error",
      error: "Failed to fetch dashboard data",
      tasks: [],
      members: [],
    };
  }
}
