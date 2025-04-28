import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@radix-ui/react-separator";
import CountUpClient from "@/components/CountUpClient";
import { DB_User } from "@/app/actions/user.action";
export default async function Auth({ user }: { user: DB_User }) {
  return (
    <Card className="p-0 pb-2 gap-0 rounded-2xl ">
      <CardHeader className="grid gap-0 px-0 justify-items-center  ">
        <div className="w-full h-[130px] rounded-2xl rounded-b-none object-cover  bg-[url('https://picsum.photos/id/237/200/300')] bg-cover bg-center" />

        <div className="w-full flex items-start gap-3 px-4">
          <Avatar className=" ring-4 ring-white w-14 h-14 dark:ring-black  translate-y-[-35%] bg-white">
            <AvatarImage
              src={user?.avatarUrl ?? ""}
              alt={user?.username ?? ""}
            />
            <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="flex flex-col pt-1 text-md font-medium overflow-hidden text-ellipsis whitespace-nowrap ">
            <span>{user?.username}</span>
            <span className="text-xs text-gray-400 dark:text-white">
              @{user?.tagName || user?.username}
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-evenly px-1 [&_div>span:first-child]:text-xl [&_div>span:first-child]:font-bold [&_div>span:last-child]:text-sm [&_div>span:last-child]:text-gray-400 dark:[&_div>span:last-child]:text-white">
        <div className="flex flex-col">
          <CountUpClient to={user?._count?.following ?? 0} duration={2} />
          <span>Following</span>
        </div>
        <Separator className="shrink-0  h-8 w-[1px] dark:bg-[#27272a]" />
        <div className="flex flex-col">
          <CountUpClient to={user?._count?.followers ?? 0} duration={2} />
          <span>Followers</span>
        </div>
        <Separator className="shrink-0  h-8 w-[1px] dark:bg-[#27272a] " />
        <div className="flex flex-col">
          <CountUpClient to={user?._count?.comments ?? 0} duration={2} />
          <span>Posts</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
