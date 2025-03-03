// import { Task } from "@/xata";

// export interface Task extends Task {
//   assigneeName: string;
// }

export interface TaskListType {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  memberId: string;
  organizationId: string;
}
