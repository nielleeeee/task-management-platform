"use client";

import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "@/components/dashboard/task-card";

export function ColumnTask({
  column,
  tasks,
  handleEdit,
  handleDelete,
}: ColumnTaskProps) {
  const { setNodeRef } = useDroppable({
    id: column.status,
  });

  return (
    <div className="rounded-lg border flex flex-col min-h-80">
      <div className="p-3 font-medium border-b bg-white">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{column.title}</h3>
        </div>
      </div>

      <div ref={setNodeRef} className="flex flex-col flex-grow p-4 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
