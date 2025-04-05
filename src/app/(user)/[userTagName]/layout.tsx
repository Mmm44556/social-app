export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="lg:col-span-9 md:col-span-9">{children}</div>;
}
