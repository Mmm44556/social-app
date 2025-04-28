import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { HeadBlobResult } from "@vercel/blob";
interface MediaCarouselProps {
  urls: { url: string; file?: File }[] | [];
  onDelete?: (image: { url: string; file?: File }) => void;
  className?: string;
  previousButtonClassName?: string;
  nextButtonClassName?: string;
  itemClassName?: string;
}
export default function MediaCarousel({
  urls,
  onDelete,
  className,
  itemClassName,
  previousButtonClassName,
  nextButtonClassName,
}: MediaCarouselProps) {
  const mediasMetadata = useQueries({
    queries: urls.map((url) => ({
      queryKey: ["media", url.url],
      queryFn: async () => {
        const metadata = await fetch(`/api/image?url=${url.url}`);
        const result = (await metadata.json()) as HeadBlobResult;
        return { ...result, defaultUrl: url.url, file: url?.file ?? null };
      },
      initialData: {
        defaultUrl: url.url,
        file: url?.file ?? null,
      },
      enabled: !(url.file instanceof File),
    })),
  });
  const metaData = mediasMetadata.map((media) => media.data) || [];
  return (
    <Carousel className={className}>
      <CarouselContent>
        {metaData.map((url, idx) => (
          <CarouselItem
            key={idx}
            className={cn("flex items-center ", itemClassName)}
          >
            <div className="relative">
              {mediaType({
                url: url?.url ?? url?.defaultUrl ?? "",
                type: url?.contentType ?? url?.file?.type ?? "",
              })}
              {onDelete && (
                <XIcon
                  className="absolute top-1 right-1 size-7 bg-black/50 rounded-full stroke-white p-1 hover:bg-black/70 transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    onDelete({
                      url: url?.defaultUrl ?? "",
                      file: url?.file ?? undefined,
                    })
                  }
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {urls.length > 1 && (
        <>
          <CarouselPrevious
            className={cn(
              "cursor-pointer group-hover:!opacity-100 !opacity-0 transition-opacity duration-200",
              previousButtonClassName
            )}
          />
          <CarouselNext
            className={cn(
              "right-0 cursor-pointer group-hover:!opacity-100 !opacity-0 transition-opacity duration-200",
              nextButtonClassName
            )}
          />
        </>
      )}
    </Carousel>
  );
}

export function mediaType({
  url,
  type,
  width = 280,
  height = 280,
  className,
}: {
  url: string;
  type: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (type.includes("image")) {
    return (
      <div className="relative">
        <Image
          src={url}
          alt={url}
          width={width}
          height={height}
          className={cn("object-cover rounded-lg", className)}
          priority
        />
      </div>
    );
  } else if (type.includes("video")) {
    return (
      <video
        src={url}
        width={width}
        height={height}
        playsInline
        muted
        loop
        controls
        className={cn("object-cover aspect-video rounded-lg h-full", className)}
      />
    );
  } else {
    return null;
  }
}
