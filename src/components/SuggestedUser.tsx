import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSuggestedUsers } from "@/app/actions/user.action";
import AuthorHeader from "./AuthorHeader";
import Advertisement from "./Advertisement";
import community from "@/app/public/community.png";
import subscription from "@/app/public/subscription.png";

export default async function SuggestedUser() {
  const suggestedUsers = await getSuggestedUsers();

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-black dark:border dark:border-white">
      {suggestedUsers.length ? (
        <CardHeader className="px-2 text-center">
          <h2 className="text-xl font-bold">People you may know</h2>
        </CardHeader>
      ) : null}
      <CardContent className="space-y-4 [&_button]:cursor-pointer">
        {suggestedUsers.length > 0
          ? suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <AuthorHeader
                  author={{
                    username: user.username,
                    tagName: user.tagName,
                    imageUrl: user.imageUrl,
                    id: user.id,
                    _count: {
                      followers: user._count.followers,
                    },
                    bio: user.bio,
                    createdAt: user.createdAt,
                    avatarUrl: user.avatarUrl,
                  }}
                />
              </div>
            ))
          : null}
        <Advertisement
          ads={[
            {
              adUrl: community.src,
            },
            {
              adUrl: subscription.src,
            },
          ]}
          cta="Subscribe Now"
          subscription={"https://github.com/Mmm44556"}
        />
      </CardContent>
    </Card>
  );
}
