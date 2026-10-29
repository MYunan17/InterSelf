"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  to: number;
  suffix?: string;
  duration?: number;
};

/** Counts from 0 to `to` the first time it becomes visible. */
export function CountUp({ to, suffix = "", duration = 1.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : duration,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref}>
      {value.toLocaleString("id")}
      {suffix}
    </span>
  );
}
