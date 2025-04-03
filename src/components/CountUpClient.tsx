"use client";

import CountUp from "@/blocks/TextAnimations/CountUp/CountUp";

interface CountUpClientProps {
  from?: number;
  to: number;
  duration?: number;
}

export default function CountUpClient({
  from = 0,
  to,
  duration = 1,
}: CountUpClientProps) {
  return (
    <CountUp
      from={from}
      to={to}
      separator=","
      direction="up"
      duration={duration}
      className="count-up-text"
    />
  );
}
