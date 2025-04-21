import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export function useCreateEditor(
  content: string,
  onChange: (content: string) => void
) {
  return useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose mx-auto focus:outline-none [&_p]:m-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });
}
