import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Grid,
  Heart,
  ImagePlay,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfileByTagName } from "@/app/actions/profile.action";
import UnAuth from "@/components/auth/unAuth";
import FollowButton from "@/components/FollowButton";
import { format } from "date-fns";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/app/actions/user.action";
import Comments from "@/components/profile/Comments";
import Replies from "@/components/profile/Replies";
import Media from "@/components/profile/Media";
import Likes from "@/components/profile/Likes";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import BioText from "@/components/profile/BioText";

export interface TabComponentProps {
  tagName: string;
  dbUserId: string | null;
}

interface ProfilePageProps {
  params: Promise<{ userTagName: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userTagName } = await params;
  const clerkUser = await currentUser();
  const currentSystemUser = await getUserByClerkId(clerkUser?.id ?? "");
  const userProfile = await getProfileByTagName(userTagName);
  if (!userProfile) return <UnAuth />;
  return (
    <div className="bg-gray-50 dark:bg-[#1A202C] sticky top-0 z-50 max-lg:relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm p-2 border-b">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full  max-lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{userProfile.username}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userProfile._count.comments} posts
              </p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="h-48 md:h-64 bg-gray-200 dark:bg-gray-800 relative">
          {/* <img
            src={""}
            alt="Profile banner"
            className="w-full h-full object-cover"
          /> */}
        </div>

        {/* Profile Info */}
        <div className="relative">
          <div className="absolute -top-16 left-4 border-4 border-white dark:border-[#1A202C] rounded-full">
            <Avatar className="h-32 w-32 max-lg:h-24 max-lg:w-24 ">
              <AvatarImage
                src={userProfile.avatarUrl || ""}
                className="object-cover"
                alt={userProfile.username}
              />
              <AvatarFallback>{userProfile.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="pt-4 px-4 sticky top-0 z-10 w-fit ml-auto flex items-center gap-2">
            <FollowButton postUserId={userProfile.id} />
            {currentSystemUser?.id === userProfile.id && (
              <ProfileEditDialog userProfile={userProfile} />
            )}
          </div>

          <div className="mt-16 px-4">
            <h1 className="text-2xl font-bold">{userProfile.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              @{userProfile.tagName}
            </p>

            {userProfile.bio && <BioText text={userProfile.bio} />}

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {format(userProfile.createdAt, "MMM yyyy")}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Link href="#" className="hover:underline">
                <span className="font-bold px-1">
                  {userProfile._count.following}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </Link>
              <Link href="#" className="hover:underline">
                <span className="font-bold px-1">
                  {userProfile._count.followers}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Followers
                </span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="mt-6  gap-0">
            <TabsList className="w-full h-12 p-0 rounded-none border-gray-950 [&_button]:cursor-pointer [&_button]:py-0 shadow-[0_1px_0_#e5e7eb] ">
              <TabsTrigger value="posts" className="flex-1 ">
                <Grid className="w-4 h-4" /> Posts
              </TabsTrigger>
              <TabsTrigger value="replies" className="flex-1">
                <MessageCircle className="w-4 h-4" />
                Replies
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                <ImagePlay className="w-4 h-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex-1">
                <Heart className="w-4 h-4" />
                Likes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="min-h-[500px]">
              <Comments
                tagName={userTagName}
                dbUserId={currentSystemUser?.id ?? ""}
              />
            </TabsContent>

            <TabsContent value="replies" className="min-h-[500px]">
              <Replies
                tagName={userTagName}
                dbUserId={currentSystemUser?.id ?? ""}
              />
            </TabsContent>

            <TabsContent value="media" className="min-h-[500px]">
              <Media
                tagName={userTagName}
                dbUserId={currentSystemUser?.id ?? ""}
              />
            </TabsContent>

            <TabsContent value="likes" className="min-h-[500px]">
              <Likes
                tagName={userTagName}
                dbUserId={currentSystemUser?.id ?? ""}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
