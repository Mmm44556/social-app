import NavBar from "@/components/nav/NavBar";

import AuthCard from "@/components/auth/Auth";
import { currentUser } from "@clerk/nextjs/server";
import UnAuth from "@/components/auth/unAuth";
import { getUserByClerkId } from "@/app/actions/user.action";
import Link from "next/link";
import Brand from "@/components/Brand";
export default async function AppLeftSidebar() {
  const user = await currentUser();
  if (!user) return <UnAuth />;
  const dbUser = await getUserByClerkId(user.id);
  if (!dbUser) return <UnAuth />;

  return (
    <aside className="hidden lg:block lg:col-span-4 ">
      <div className="flex flex-col gap-6 sticky top-0">
        <Brand />
        <AuthCard user={dbUser} />
        <NavBar user={dbUser} />
      </div>
    </aside>
  );
}
