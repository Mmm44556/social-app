import { getDbUser, getDbUserId } from "@/app/actions/user.action";
import { useQuery } from "@tanstack/react-query";

export const useGetDbUserId = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["currentUserId"],
    queryFn: async () => {
      const dbUser = await getDbUserId();
      return dbUser || "";
    },
  });
  return { data, isLoading };
};

export const useGetDbUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const dbUser = await getDbUser();
      return dbUser;
    },
  });
  return { data, isLoading };
};
