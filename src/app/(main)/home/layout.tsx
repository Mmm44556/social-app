export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="lg:col-span-9 md:col-span-9 space-y-6">{children}</main>
  );
}
