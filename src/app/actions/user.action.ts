"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return null;

    // check if user exists in db
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        username: `${user.firstName || ""} ${user.lastName || ""}`,
        imageUrl: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error syncing user", error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            likes: true,
          },
        },
      },
    });
    if (!user) {
      return await syncUser();
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("User not found");
  try {
    const user = await getUserByClerkId(clerkId);
    return user?.id;
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}

export async function getSuggestedUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    // get 3 users except the current user and the users that the current user is not following
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      take: 3,
      select: {
        id: true,
        username: true,
        imageUrl: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    console.error("Error getting suggested users", error);
    return [];
  }
}

// export async function toggleFollow(targetUserId: string) {
//   try {
//     const userId = await getDbUserId();
//     if (!userId) throw new Error("User not found");
//     if (userId === targetUserId) throw new Error("You cannot follow yourself");

//     // check if the user is already following the target user
//     const existingFollow = await prisma.follow.findUnique({
//       where: {
//         followerId_followingId: {
//           followerId: userId,
//           followingId: targetUserId,
//         },
//       },
//     });
//     if (existingFollow) {
//       // user is already following, so we need to unfollow
//       await prisma.follow.delete({
//         where: {
//           followerId_followingId: {
//             followerId: userId,
//             followingId: targetUserId,
//           },
//         },
//       });
//       revalidatePath("/home");
//       return { success: true };
//     } else {
//       console.log("follower", userId);
//       console.log("following", targetUserId);
//       // user is not following, so we need to follow
//       await prisma.$transaction([
//         prisma.follow.create({
//           data: {
//             followerId: userId,
//             followingId: targetUserId,
//           },
//         }),

//         prisma.notification.create({
//           data: {
//             userId: targetUserId,
//             creatorId: userId,
//             type: "FOLLOW",
//           },
//         }),
//       ]);
//       revalidatePath("/home");
//       return { success: true };
//     }
//   } catch (error) {
//     console.error("Error following user", error);
//     return { success: false };
//   }
// }
export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.$transaction([
        prisma.follow.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // user being followed
            creatorId: userId, // user following
          },
        }),
      ]);
    }

    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}
