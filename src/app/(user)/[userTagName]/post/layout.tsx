import HomeLayout from "@/app/home/layout";
import MainHeader from "@/components/MainHeader";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayout>
      {/* Header */}
      <MainHeader />
      {children}
    </HomeLayout>
  );
}
