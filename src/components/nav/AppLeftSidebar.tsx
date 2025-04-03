import NavBar from "@/components/nav/NavBar";

import AuthCard from "@/components/auth/Auth";
import { currentUser } from "@clerk/nextjs/server";
import UnAuth from "@/components/auth/unAuth";
import { getUserByClerkId } from "@/app/actions/user.action";

export default async function AppLeftSidebar() {
  const user = await currentUser();
  if (!user) return <UnAuth />;
  const dbUser = await getUserByClerkId(user.id);
  if (!dbUser) return <UnAuth />;

  return (
    <div className="hidden lg:block lg:col-span-4 ">
      <div className="sticky top-20 space-y-6 ">
        <AuthCard user={dbUser} />
        <NavBar user={dbUser} />
      </div>
    </div>
  );
}
