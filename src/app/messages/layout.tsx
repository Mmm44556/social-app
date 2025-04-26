export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 col-span-8 max-lg:col-span-5 max-lg:py-0">
      {children}
    </div>
  );
}
