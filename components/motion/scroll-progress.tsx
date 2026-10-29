"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient bar at the top of the page that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 70,
        transformOrigin: "0% 50%",
        background: "linear-gradient(90deg, #8b5cf6, #2dd4bf, #facc15)",
        boxShadow: "0 0 14px rgba(139, 92, 246, 0.8)",
      }}
    />
  );
}
