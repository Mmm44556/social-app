"use client"; // Error boundaries must be Client Components

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [resetCount, setResetCount] = useState(0);
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="lg:col-span-9 md:col-span-9 flex flex-col items-center justify-center h-full">
      <h2>Something went wrong!</h2>
      <button
        className="flex items-center gap-2 cursor-pointer hover:text-theme transition-colors duration-150"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => {
            if (resetCount < 3) {
              reset();
              setResetCount((prev) => prev + 1);
            } else {
              router.push("/");
            }
          }
        }
      >
        Try again
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
