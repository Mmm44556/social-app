"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
export async function getProfileByTagName(tagName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { tagName },
      select: {
        username: true,
        tagName: true,
        imageUrl: true,
        email: true,
        id: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            comments: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting profile by tagName", error);
    return null;
  }
}

type GetCommentsByTagNameProps = {
  tagName: string;
  limit?: number;
  cursor?: string;
  isRoot?: boolean;
  options?: Prisma.CommentFindManyArgs;
};
export async function getCommentsByTagName({
  tagName,
  limit = undefined,
  cursor = undefined,
  isRoot = true,
  options = {},
}: GetCommentsByTagNameProps) {
  const pagination = cursor
    ? {
        cursor: { id: cursor },
        skip: 1,
      }
    : null;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        author: {
          tagName,
        },
        isRoot,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            tagName: true,
            bio: true,
            createdAt: true,
            _count: {
              select: {
                followers: true,
                likes: true,
              },
            },
          },
        },
        ...(isRoot
          ? {}
          : {
              ancestors: {
                orderBy: {
                  depth: "asc",
                },
              },
            }),
        descendants: {
          where: {
            depth: 1,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            descendants: true,
          },
        },
        ...options.include,
      },
      orderBy: [{ id: "desc" }],
      take: limit,
      ...(pagination || {}),
    });

    const commentsWithAncestors = isRoot
      ? comments
      : await Promise.all(
          comments.map(async (comment) => {
            const ancestorComments = await Promise.all(
              comment.ancestors.map(async (ancestor) => {
                const ancestorComment = await prisma.comment.findUnique({
                  where: { id: ancestor.ancestorId },
                  include: {
                    author: {
                      select: {
                        id: true,
                        username: true,
                        imageUrl: true,
                        tagName: true,
                        bio: true,
                        createdAt: true,
                        _count: {
                          select: {
                            followers: true,
                            likes: true,
                          },
                        },
                      },
                    },
                    descendants: {
                      where: {
                        depth: 1,
                      },
                    },
                    likes: {
                      select: {
                        userId: true,
                      },
                    },
                    _count: {
                      select: {
                        likes: true,
                        descendants: true,
                      },
                    },
                  },
                });

                return ancestorComment
                  ? {
                      ...ancestorComment,
                      likeCount: ancestorComment.likes.length,
                      replyCount: ancestorComment.descendants.length,
                      depth: ancestor.depth,
                    }
                  : null;
              })
            );

            const validAncestors = ancestorComments
              .filter(
                (ancestor): ancestor is NonNullable<typeof ancestor> =>
                  ancestor !== null
              )
              .sort((a, b) => a.depth - b.depth)
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            const rootComment = validAncestors.find(
              (ancestor) => ancestor.depth === 0
            );
            const parentComment = validAncestors.find(
              (ancestor) => ancestor.depth === 1
            );

            return {
              ...comment,
              // rootComment: rootComment || null,
              // parentComment: parentComment || null,
              ancestors: validAncestors,
              replyCount: comment.descendants.length,
              likeCount: comment.likes.length,
            };
          })
        );

    const commentsWithReplies = await Promise.all(
      commentsWithAncestors.map(async (comment) => {
        const replies = await Promise.all(
          comment.descendants.map(async (d) => {
            const reply = await prisma.comment.findUnique({
              where: { id: d.descendantId },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    imageUrl: true,
                    tagName: true,
                    bio: true,
                    createdAt: true,
                    _count: {
                      select: {
                        followers: true,
                        likes: true,
                      },
                    },
                  },
                },
                descendants: {
                  where: {
                    depth: 1,
                  },
                },
                likes: {
                  select: {
                    userId: true,
                  },
                },
                _count: {
                  select: {
                    likes: true,
                    descendants: true,
                  },
                },
              },
            });

            return reply
              ? {
                  ...reply,
                  likeCount: reply.likes.length,
                  replyCount: reply.descendants.length,
                }
              : null;
          })
        );

        const validReplies = replies.filter(
          (reply): reply is NonNullable<typeof reply> => reply !== null
        );

        return {
          ...comment,
          replies: validReplies,
          replyCount: validReplies.length,
          likeCount: comment.likes.length,
        };
      })
    );

    return commentsWithReplies;
  } catch (error) {
    console.error("Error getting comments by tagName", error);
    return [];
  }
}

export async function getLikesByTagName(tagName: string) {
  try {
    const likes = await prisma.user.findMany({
      where: { tagName },
      include: {
        likes: true,
      },
    });
    return likes;
  } catch (error) {
    console.error("Error getting likes by tagName", error);
    return null;
  }
}

export async function getSharedsByTagName(tagName: string) {
  try {
    const shareds = await prisma.user.findMany({
      where: { tagName },
      include: {
        shares: true,
      },
    });
    return shareds;
  } catch (error) {
    console.error("Error getting shareds by tagName", error);
    return null;
  }
}

export async function updateProfile(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const { username, tagName, bio, imageUrl } = Object.fromEntries(formData) as {
    username: string;
    tagName: string;
    bio: string;
    imageUrl: string;
  };
  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: { username, tagName, bio, imageUrl },
    });
    revalidatePath(`/${user.tagName}`);
    return user;
  } catch (error) {
    console.error("Error updating profile", error);
    return null;
  }
}
