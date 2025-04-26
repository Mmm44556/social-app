import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}
export function PostSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("p-6 mb-0 border-t", className)}>
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

interface MediaSkeletonProps {
  className?: string;
}
export function MediaSkeleton({ className }: MediaSkeletonProps) {
  return (
    <div className={cn("aspect-square", className)}>
      <Skeleton className="w-full h-full rounded-sm" />
    </div>
  );
}

interface NotificationSkeletonProps {
  className?: string;
}
export function NotificationSkeleton({ className }: NotificationSkeletonProps) {
  return (
    <div className={cn("py-4 px-6", className)}>
      <div className="flex gap-2 items-center">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 rounded-sm" />
          <Skeleton className="h-3 w-1/2 mt-2 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
type SkeletonTypes = "post" | "media" | "notification";

interface PostSkeletonListProps {
  length?: number;
  type?: SkeletonTypes;
  children?: React.ReactNode;
  className?: string;
}
export function SkeletonList({
  length = 8,
  type = "post",
  className,
  children,
}: PostSkeletonListProps) {
  return (
    <div className={cn("flex flex-col gap-4 ", className)}>
      {Array.from({ length }).map((_, index) => (
        <SwitchSkeletonType
          type={type}
          key={index}
          className={index === 0 ? "border-t-0" : ""}
        />
      ))}
    </div>
  );
}

interface SwitchSkeletonTypeProps {
  type: SkeletonTypes;
  className?: string;
}
function SwitchSkeletonType({ type, className }: SwitchSkeletonTypeProps) {
  switch (type) {
    case "post":
      return <PostSkeleton className={className} />;
    case "media":
      return <MediaSkeleton className={className} />;
    case "notification":
      return <NotificationSkeleton className={className} />;
    default:
      return null;
  }
}
