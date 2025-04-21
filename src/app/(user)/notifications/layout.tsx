export default async function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 col-span-6 max-lg:col-span-5 max-lg:pt-10 max-lg:pb-16">
      {children}
    </div>
  );
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
