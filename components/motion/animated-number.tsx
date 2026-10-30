"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  format?: (value: number) => string;
};

/** Tweens from the previous value to the new one whenever `value` changes. */
export function AnimatedNumber({
  value,
  duration = 0.8,
  format = (next) => next.toLocaleString("id"),
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: reduce ? 0 : duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  return <>{format(display)}</>;
}
