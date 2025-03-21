"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/app/actions/dashboard/update-task";
import { TaskBoardType } from "../../../types";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Define the Zod schema
const formSchema = z.object({
  id: z.string(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  assigneeId: z.string().min(0, {
    message: "Please select an assignee.",
  }),
});

interface EditTaskFormProps {
  task: TaskBoardType;
  teamMembers: { id: string; name: string }[];
  onClose: () => void;
}

export function EditTaskForm({
  task,
  teamMembers,
  onClose,
}: EditTaskFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: task.id,
      title: task.title,
      description: task.description || "",
      assigneeId: task.assigneeId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await mutation.mutateAsync({
        id: task.id,
        title: values.title,
        description: values.description || null,
        assigneeId: values.assigneeId,
      });

      if (result.success) {
        onClose();
      } else {
        console.error("Task creation failed:", result.error);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit the task details.</DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name="title"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage>{formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage>{formState.errors.description?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{formState.errors.assigneeId?.message}</FormMessage>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || !form.formState.isValid}
            className="cursor-pointer"
          >
            Update Task
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
