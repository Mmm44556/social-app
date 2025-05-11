"use client";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
interface Advertisement {
  adUrl: string;
}

interface AdvertisementProps {
  ads: Advertisement[];
  featured?: boolean;
  subscription?: string;
  cta?: string;
}

export default function Advertisement({
  ads,
  featured = false,
  subscription,
  cta,
}: AdvertisementProps) {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  return (
    <div className={`relative rounded-lg ${featured ? "bg-muted/30" : ""}`}>
      <div className="space-y-3">
        <Carousel
          plugins={[plugin.current]}
          opts={{ loop: true }}
          className="w-full max-w-xs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {ads.map((ad, idx) => (
              <CarouselItem key={idx}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center px-3">
                      <Image
                        src={ad.adUrl}
                        alt="Advertisement"
                        width={1000}
                        height={1000}
                        className="rounded-md"
                        aria-hidden="true"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="space-y-1.5">
          <h3 className="font-semibold">Premium Subscription</h3>
          <p className="text-xs text-muted-foreground">
            Get access to exclusive content and features
          </p>
        </div>
        <div className="flex items-center">
          <Link
            href={subscription || ""}
            target="_blank"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-80 transition-opacity duration-200"
          >
            {cta}
            <ExternalLink className="ml-1.5 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
