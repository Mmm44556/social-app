// Types for User model from Prisma
export type DB_User = {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  imageUrl?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  _count?: {
    followers: number;
    following: number;
    posts: number;
    likes: number;
  };
};
