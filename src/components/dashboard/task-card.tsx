"use client";

import { useDraggable } from "@dnd-kit/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Grip, Trash } from "lucide-react";

interface TaskCardProps {
  task: TaskBoardType;
  handleEdit: (taskId: string) => void;
  handleDelete: (taskId: string) => void;
}

export function TaskCard({ task, handleEdit, handleDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <Card key={task.id} className="relative cursor-pointer" style={style}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="drag-handle absolute top-4 right-4 cursor-grab select-none"
      >
        <Grip className="h-4 w-4" />
      </div>

      <CardHeader className="">
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>Assigned to: {task.assigneeName}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 lg:flex-row justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer w-full lg:w-auto"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(task.id);
              }}
            >
              Edit
            </Button>
          </DialogTrigger>
        </Dialog>

        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(task.id);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
