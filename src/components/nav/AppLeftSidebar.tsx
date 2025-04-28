import NavBar from "@/components/nav/NavBar";

import AuthCard from "@/components/auth/Auth";
import { currentUser } from "@clerk/nextjs/server";
import UnAuth from "@/components/auth/unAuth";
import { getUserByClerkId } from "@/app/actions/user.action";
import Brand from "@/components/Brand";
export default async function AppLeftSidebar() {
  const user = await currentUser();
  if (!user) return <UnAuth />;
  const dbUser = await getUserByClerkId(user.id);

  return (
    <aside className="col-span-2 max-lg:hidden ">
      <div className="flex flex-col gap-6 sticky top-6 ">
        <Brand />
        {dbUser ? (
          <>
            <AuthCard user={dbUser} />
            <NavBar user={dbUser} />
          </>
        ) : (
          <UnAuth />
        )}
      </div>
    </aside>
  );
}
