import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center space-y-6 col-span-6 max-lg:col-span-5 max-lg:pt-10 max-lg:pb-16">
      <LoaderCircle className="h-8 w-8 animate-spin " />
    </div>
  );
}
