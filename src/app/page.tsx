import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/dashboard";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // const user = session.user;

  // const SampleSeedData = () => {
  //   return (
  //     <form action={seedData}>
  //       <Button type="submit" className="w-full cursor-pointer">
  //         Sample Seed Data
  //       </Button>
  //     </form>
  //   );
  // };

  return (
    <main className="h-screen py-20 px-4">
      <div className="container mx-auto pt-6">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>
      </div>

      <Dashboard />
    </main>
  );
}
