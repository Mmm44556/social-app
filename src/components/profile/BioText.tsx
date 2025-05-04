import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BioTextProps {
  text: string;
  className?: string;
}

export default function BioText({ text, className }: BioTextProps) {
  const parsedText = useMemo(() => {
    // First, split by URLs to preserve URL detection
    const urlParts = text.split(/(https?:\/\/[^\s]+)/g);
    return urlParts.map((part, index) => {
      // Check if the part is a URL
      if (part.match(/^https?:\/\/[^\s]+$/)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean-blue hover:underline"
          >
            {part}
          </Link>
        );
      }

      // For non-URL parts, render HTML content
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  }, [text]);

  return (
    <span className={cn("mt-4 whitespace-pre-wrap", className)}>
      {parsedText}
    </span>
  );
}
