"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/app/actions/dashboard/delete-task";
import { updateTaskStatus } from "@/app/actions/dashboard/update-task-status";
import { ColumnTask } from "@/components/dashboard/column-task";
import { EditTaskForm } from "@/components/dashboard/edit-task";
import { DragEndEvent, DndContext } from "@dnd-kit/core";
import { useDebouncedCallback } from "use-debounce";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function objectsAreEqual(obj1: TaskBoardType, obj2: TaskBoardType): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function TaskBoard({ organizationTasks, teamMembers }: TaskBoardProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskBoardType[]>(organizationTasks);
  const taskQueue = useRef(new Map<string, TaskBoardType>());
  const originalTaskStates = useRef(new Map<string, TaskBoardType>());

  useEffect(() => {
    setTasks(organizationTasks);

    // Initialize originalTaskStates with organizationTasks
    const initialStates = new Map<string, TaskBoardType>();

    organizationTasks.forEach((task) => {
      initialStates.set(task.id, task);
    });

    originalTaskStates.current = initialStates;
  }, [organizationTasks]);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setDeleteTaskId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const debounceUpdate = useDebouncedCallback(() => {
    const queue = Array.from(taskQueue.current.values());

    taskQueue.current.clear();

    if (queue.length === 0) {
      console.log("No tasks changed, skipping update.");

      return;
    }

    console.log("Task to be updated:", queue);

    queue.forEach(async (task) => {
      const result = await updateMutation.mutateAsync(task);

      console.log("Mutation result:", result);
    });
  }, 5000);

  const handleDragEndEvent = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskBoardType["status"];

    const queuedTaskIds = new Set<string>();

    setTasks((prevTasks) => {
      const originalTask = prevTasks.find((task) => task.id === taskId);

      if (originalTask?.status === newStatus) {
        taskQueue.current.delete(taskId);

        return prevTasks;
      }

      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      const newTasks = [...updatedTasks];

      const updatedTask = newTasks.find((task) => task.id === taskId);

      if (!updatedTask) {
        return newTasks;
      }

      if (queuedTaskIds.has(updatedTask.id)) {
        return newTasks;
      }

      queuedTaskIds.add(updatedTask.id);

      const originalState = originalTaskStates.current.get(updatedTask.id);

      console.log("Original Task States", originalTaskStates.current);
      console.log("Original Task", originalState);
      console.log("Current Task", updatedTask);

      if (originalState && objectsAreEqual(originalState, updatedTask)) {
        taskQueue.current.delete(updatedTask.id);

        console.log("Task reverted, removed from queue:", updatedTask.id);
        return newTasks;
      }

      taskQueue.current.set(updatedTask.id, updatedTask);
      debounceUpdate();

      console.log("qeued task:", queuedTaskIds);

      return newTasks;
    });
  };

  const handleEdit = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseEdit = () => {
    setSelectedTaskId(null);
  };

  const handleDelete = (taskId: string | null) => {
    setDeleteTaskId(taskId);
  };

  const confirmDelete = async () => {
    if (deleteTaskId !== null) {
      await deleteMutation.mutateAsync({
        id: deleteTaskId,
      });
    }
  };

  const COLUMNS: ColumnTaskType[] = [
    { status: "todo", title: "To Do" },
    { status: "in_progress", title: "In Progress" },
    { status: "done", title: "Done" },
    { status: "blocked", title: "Blocked" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DndContext onDragEnd={handleDragEndEvent} >
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.status
            );

            return (
              <ColumnTask
                key={column.status}
                column={column}
                tasks={columnTasks}
                teamMembers={teamMembers}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            );
          })}
        </DndContext>
      </div>

      {selectedTaskId !== null && selectedTaskId !== undefined && (
        <Dialog open={selectedTaskId !== null} onOpenChange={handleCloseEdit}>
          <DialogContent>
            <EditTaskForm
              task={
                organizationTasks.find(
                  (task) => task.id === selectedTaskId
                ) as TaskBoardType
              }
              teamMembers={teamMembers}
              onClose={handleCloseEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog
        open={deleteTaskId !== null}
        onOpenChange={() => setDeleteTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={confirmDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
