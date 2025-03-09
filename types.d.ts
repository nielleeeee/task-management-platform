// import { Task } from "@/xata";

enum TaskStatus {
  todo = "todo",
  in_progress = "in_progress",
  done = "done",
  blocked = "blocked",
}

export interface TaskBoardType {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  memberId: string;
  status: TaskStatus;
  organizationId: string;
}

export interface ColumnTask {
  status: TaskStatus;
  title: string;
}

export interface ColumnTaskProps {
  column: ColumnTask;
  tasks: TaskListType[];
  teamMembers: { id: string; name: string }[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}
