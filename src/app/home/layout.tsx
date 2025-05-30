export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 col-span-6 py-6 max-xl:col-span-5 max-lg:pt-10 max-lg:pb-16">
      {children}
    </div>
  );
}
