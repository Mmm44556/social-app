import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
export function PostSkeleton() {
  return (
    <div className="p-6 mb-0 border-t">
      {/* Avatar */}
      <div className="flex items-center gap-2  ">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-full lg:w-1/4 rounded-sm" />
      </div>
      <div className="pl-12 h-28">
        <Skeleton className="w-full h-full rounded-sm" />
      </div>
    </div>
  );
}
function MediaSkeleton() {
  return (
    <div className="aspect-square">
      <Skeleton className="w-full h-full rounded-sm" />
    </div>
  );
}

interface PostSkeletonListProps {
  length?: number;
  type?: "post" | "media";
  className?: string;
}
export function SkeletonList({
  length = 8,
  type = "post",
  className,
}: PostSkeletonListProps) {
  return (
    <div className={cn("flex flex-col gap-4 ", className)}>
      {Array.from({ length }).map((_, index) =>
        type === "post" ? (
          <PostSkeleton key={index} />
        ) : (
          <MediaSkeleton key={index} />
        )
      )}
    </div>
  );
}
