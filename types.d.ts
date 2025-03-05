// import { Task } from "@/xata";

// export interface Task extends Task {
//   assigneeName: string;
// }

export interface TaskBoardType {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  memberId: string;
  status: "todo" | "in_progress" | "done" | "blocked";
  organizationId: string;
}

export interface ColumnTask {
  status: "todo" | "in_progress" | "done" | "blocked";
  title: string;
}

export interface ColumnTaskProps {
  column: ColumnTask;
  tasks: TaskListType[];
  teamMembers: { id: string; name: string }[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}
