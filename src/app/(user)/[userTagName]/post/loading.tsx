import HomeLayout from "@/app/home/layout";
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <HomeLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Skeleton className="sticky h-20 top-0 z-10 p-2 " />
      </div>
    </HomeLayout>
  );
}
