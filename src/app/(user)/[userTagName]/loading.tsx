import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <Skeleton className="sticky h-20 top-0 z-10 p-2 " />

      {/* Banner */}
      <Skeleton className="h-48 md:h-64  " />

      {/* Profile Info */}
      <div className="relative">
        <Skeleton className="absolute -top-16 left-4 border-4 border-white dark:border-black rounded-full h-32 w-32 max-lg:h-24 max-lg:w-24" />

        <div className="pt-4 px-4 sticky top-0 z-10 w-fit ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="mt-16 px-4 space-y-2">
          <Skeleton className="text-2xl font-bold h-8 w-48" />
          <Skeleton className="text-gray-500 dark:text-gray-400 h-4 w-24" />

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-gray-500 dark:text-gray-400">
            <Skeleton className="flex items-center gap-1 h-4 w-24" />
          </div>

          <div className="flex gap-4 mt-4">
            <Skeleton className="hover:underline h-6 w-24" />
            <Skeleton className="hover:underline h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
