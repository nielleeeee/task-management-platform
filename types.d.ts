type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

interface TaskBoardType {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  memberId: string;
  status: TaskStatus;
  organizationId: string;
}

interface ColumnTaskType {
  status: TaskStatus;
  title: string;
}

interface ColumnTaskProps {
  column: ColumnTaskType;
  tasks: TaskBoardType[];
  teamMembers: { id: string; name: string }[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

interface TaskBoardProps {
  organizationTasks: TaskBoardType[];
  teamMembers: { id: string; name: string }[];
}

interface UpdateTaskStatusProps {
  id: string;
  status: TaskStatus;
}