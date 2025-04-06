"use client";

import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Brand() {
  const router = useRouter();
  return (
    <>
      Nexus
      {/* <SplitText
        onClick={() => router.push("/")}
        text="Nexus"
        className="hover:cursor-pointer brand-stroke-white tracking-wide text-black text-4xl dark:brand-stroke-black dark:text-white  gap-2 font-bold col-span-4 flex items-center justify-center"
        delay={150}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        threshold={0.2}
        rootMargin="-50px"
      /> */}
    </>
  );
}
