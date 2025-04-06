import { getQueryClient } from "@/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getMockNotifications } from "./test";

export default async function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="lg:col-span-9 md:col-span-9">{children}</div>;
}
// export default function NotificationsLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const quertClient = getQueryClient();
//   const dehydratedState = dehydrate(quertClient);
//   quertClient.prefetchQuery({
//     queryKey: ["notifications"],
//     queryFn: async () => getMockNotifications(),
//   });
//   return (
//     <HydrationBoundary state={dehydratedState}>
//       <div className="lg:col-span-9 md:col-span-9">{children}</div>
//     </HydrationBoundary>
//   );
// }
