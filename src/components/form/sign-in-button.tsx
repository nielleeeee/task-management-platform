import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInButton() {
  return (
    <Link href="/sign-in">
      <Button type="submit" className="w-full cursor-pointer">
        Sign Out
      </Button>
    </Link>
  );
}
