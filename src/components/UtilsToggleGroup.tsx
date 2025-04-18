import { Sparkles } from "lucide-react";

import { Button } from "./ui/button";
import { Image as ImageIcon } from "lucide-react";
export function UtilsToggleGroup() {
  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="icon" className="rounded-full">
        <ImageIcon className="h-5 w-5 text-theme" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="group rounded-full hover:bg-gray-200 "
      >
        <Sparkles className="h-5 w-5 text-theme group-hover:text-[#f6c604]" />
      </Button>
    </div>
  );
}
