import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

type EditorProps = {
  placeholder?: string;
  className?: string;
};
export function useCreateEditor(
  content: string,
  onChange: (content: string) => void,
  editorProps?: EditorProps
) {
  return useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "w-full h-full object-cover",
        },
      }),
      Placeholder.configure({
        placeholder: editorProps?.placeholder || "2 something...",
      }),
    ],
    content,

    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose mx-auto focus:outline-none [&_p]:m-0 max-lg:mx-0",
          editorProps?.className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });
}
