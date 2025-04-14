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
interface ImagesCarouselProps {
  images: { url: string; file?: File }[];
  onDelete?: (image: { url: string; file?: File }) => void;
  className?: string;
  previousButtonClassName?: string;
  nextButtonClassName?: string;
  itemClassName?: string;
}
export default function ImagesCarousel({
  images,
  onDelete,
  className,
  itemClassName,
  previousButtonClassName,
  nextButtonClassName,
}: ImagesCarouselProps) {
  return (
    <Carousel className={className}>
      <CarouselContent>
        {images.map((image, idx) => (
          <CarouselItem
            key={idx}
            className={cn("flex items-center ", itemClassName)}
          >
            <div className="relative">
              <Image
                src={image.url}
                alt={image.url}
                priority
                className="object-cover aspect-square"
                width={250}
                height={250}
              />
              {onDelete && (
                <XIcon
                  className="absolute top-1 right-1 size-7 bg-black/50 rounded-full stroke-white p-1 hover:bg-black/70 transition-all duration-300 cursor-pointer"
                  onClick={() => onDelete(image)}
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
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
