import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/sign-out-action";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" className="w-full cursor-pointer">
        Sign Out
      </Button>
    </form>
  );
}
