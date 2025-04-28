import { getUsersForMessages } from "@/app/actions/user.action";
import UserList from "@/app/messages/components/UserList";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsersForMessages();
  return (
    <div className="space-y-6 col-span-8 max-lg:col-span-5 max-lg:py-0">
      <div className=" w-full h-full grid xl:grid-cols-[24rem_1fr] md:grid-cols-[20rem_1fr] max-lg:pt-5 max-lg:grid-cols-subgrid">
        <UserList users={users} />
        {children}
      </div>
    </div>
  );
}
