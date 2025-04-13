"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  ImageIcon,
  Italic,
  SmilePlusIcon,
  Sparkles,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
const utilsItems = [
  {
    icon: <ImageIcon />,
  },
  {
    icon: <Sparkles />,
  },
  {
    icon: <SmilePlusIcon />,
  },
];
export default function CommentUtilsBar() {
  return (
    <>
      <div className="flex items-center justify-start px-1">
        {utilsItems.map((item, idx) => (
          <Button
            variant="utils"
            size="utils"
            className="rounded-full"
            key={idx}
          >
            {item.icon}
          </Button>
        ))}

        <ToggleGroup type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" asChild>
            <Button variant="utils" className="rounded-full" size="utils">
              <Bold className="h-4 w-4" />
            </Button>
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" asChild>
            <Button variant="utils" className="rounded-full" size="utils">
              <Italic className="h-4 w-4" />
            </Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
            asChild
          >
            <Button variant="utils" className="rounded-full" size="utils">
              <Underline className="h-4 w-4" />
            </Button>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}
