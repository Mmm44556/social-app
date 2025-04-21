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
import { memo } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Editor } from "@tiptap/react";

const utilsItems = [
  {
    icon: <Sparkles />,
  },
  {
    icon: <SmilePlusIcon />,
  },
];

interface CommentUtilsBarProps {
  setImages: React.Dispatch<
    React.SetStateAction<Array<{ url: string; file: File }>>
  >;
  inputFileRef: React.RefObject<HTMLInputElement | null>;
  editor: Editor | null;
}

export default function CommentUtilsBar({
  setImages,
  inputFileRef,
  editor,
}: CommentUtilsBarProps) {
  if (!editor) return null;
  return (
    <>
      <div className="flex items-center justify-start px-1 max-md:flex-wrap">
        <UploadButton
          setImages={setImages}
          inputFileRef={inputFileRef}
          editor={editor}
        />
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
          <ToggleGroupItem
            value="bold"
            aria-label="Toggle bold"
            className="h-9 min-w-9 p-0 rounded-full bg-transparent border-0 shadow-none hover:bg-gray-100/50 hover:transition-colors hover:duration-200"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-state={editor.isActive("bold") ? "on" : "off"}
          >
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Toggle italic"
            className="h-9 min-w-9 p-0 rounded-full bg-transparent border-0 shadow-none hover:bg-gray-100/50 hover:transition-colors hover:duration-200"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-state={editor.isActive("italic") ? "on" : "off"}
          >
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strike"
            aria-label="Toggle strikethrough"
            className="h-9 min-w-9 p-0 rounded-full bg-transparent border-0 shadow-none hover:bg-gray-100/50 hover:transition-colors hover:duration-200"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            data-state={editor.isActive("strike") ? "on" : "off"}
          >
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}

const UploadButton = memo(
  ({ setImages, inputFileRef }: CommentUtilsBarProps) => {
    return (
      <Button variant="utils" className="rounded-full" size="utils" asChild>
        <Label>
          <Input
            ref={inputFileRef}
            className="hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                Array.from(files).forEach((file) => {
                  const blobUrl = URL.createObjectURL(file);
                  setImages((prev) => [
                    ...prev,
                    {
                      url: blobUrl,
                      file,
                    },
                  ]);
                });
              }
            }}
          />
          <ImageIcon />
        </Label>
      </Button>
    );
  }
);
UploadButton.displayName = "UploadButton";
