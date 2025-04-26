import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-6 col-span-8 max-lg:col-span-5 max-lg:pt-10 max-lg:pb-16">
      <LoaderCircle className="h-10 w-10 animate-spin mx-auto" />
    </div>
  );
}
