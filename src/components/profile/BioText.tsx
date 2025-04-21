import { useMemo } from "react";
import Link from "next/link";

interface BioTextProps {
  text: string;
}

export default function BioText({ text }: BioTextProps) {
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

  return <div className="mt-4 whitespace-pre-wrap">{parsedText}</div>;
}
