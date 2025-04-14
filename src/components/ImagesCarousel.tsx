import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImagesCarouselProps {
  images: string[];
}
export default function ImagesCarousel({ images }: ImagesCarouselProps) {
  return (
    <Carousel>
      <CarouselContent
        onDrag={(e) => {
          e.stopPropagation();
        }}
      >
        {images.map((url, idx) => (
          <CarouselItem
            key={idx}
            className="px-10s flex justify-centers items-center "
          >
            <div className="relative">
              <Image
                src={url}
                alt={url}
                priority
                className="object-cover aspect-square"
                width={250}
                height={250}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious className="left-0 cursor-pointer" /> */}
      {/* <CarouselNext className="right-0 cursor-pointer" /> */}
    </Carousel>
  );
}
