"use client";

import { useState } from "react";
import { CreateTaskForm } from "@/components/dashboard/create-task";
import { TaskBoard } from "@/components/dashboard/task-board";
import { fetchDashboardData } from "@/app/actions/dashboard/get-dashboard-data";
import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const { data, isError, error, isLoading } = useQuery({
    queryFn: fetchDashboardData,
    queryKey: ["dashboard"],
  });

  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);

  if (isLoading) {
    return (
      <section className="container mx-auto py-6">
        <p>Loading dashboard data...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto py-6">
        <p>Error loading dashboard data: {error?.message}</p>
      </section>
    );
  }

  const organizationTasks: TaskBoardType[] = data?.tasks || [];
  const organizationMembers = data?.members || [];

  return (
    <section className="container mx-auto py-6">
      <div className="flex items-center justify-end mb-6">
        {/* Create task dialog */}
        <Dialog
          open={openCreateTaskDialog}
          onOpenChange={setOpenCreateTaskDialog}
        >
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <CreateTaskForm
              teamMembers={organizationMembers}
              onClose={() => setOpenCreateTaskDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TaskBoard
        teamMembers={organizationMembers}
        organizationTasks={organizationTasks}
      />
    </section>
  );
}
