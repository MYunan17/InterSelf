"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";

const MAX_LEVEL = 10;

// The landing page is the "world map": each section is a zone, scrolling earns EXP.
const ZONES: { id: string; name: string }[] = [
  { id: "zone-hero", name: "Title Screen" },
  { id: "zone-class", name: "Character Select" },
  { id: "zone-quest", name: "Quest Board" },
  { id: "zone-features", name: "Armory" },
  { id: "zone-loop", name: "World Map" },
  { id: "zone-final", name: "Final Gate" },
];

type Toast = { id: number; title: string; text: string };

/**
 * A small HUD pinned to the corner of the landing page: scrolling fills the EXP bar, every full
 * bar is a level, and the current section is shown as the zone you are in.
 */
export function LandingGameHud() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [zone, setZone] = useState(ZONES[0]!.name);
  const [toast, setToast] = useState<Toast | null>(null);
  const bestLevel = useRef(1);
  const toastId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => scrollYProgress.on("change", (value) => setProgress(Math.min(1, Math.max(0, value)))), [scrollYProgress]);

  // Which zone is on screen
  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        let best: string | null = null;
        let ratio = 0;
        for (const [id, value] of visible) {
          if (value >= ratio) {
            best = id;
            ratio = value;
          }
        }
        const found = ZONES.find((item) => item.id === best);
        if (found) setZone(found.name);
      },
      { threshold: [0.15, 0.4, 0.7] }
    );
    for (const item of ZONES) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  const scaled = progress * (MAX_LEVEL - 1);
  const level = Math.min(MAX_LEVEL, 1 + Math.floor(scaled));
  const exp = level >= MAX_LEVEL ? 100 : Math.round((scaled - Math.floor(scaled)) * 100);

  // Announce level ups (only upwards, so scrolling back does not spam)
  useEffect(() => {
    if (level <= bestLevel.current) return;
    bestLevel.current = level;
    toastId.current += 1;
    setToast(
      level === MAX_LEVEL
        ? { id: toastId.current, title: "ACHIEVEMENT UNLOCKED", text: "Penjelajah: kamu sampai di gerbang terakhir" }
        : { id: toastId.current, title: "LEVEL UP!", text: `Level ${level} tercapai` }
    );
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }, [level]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <>
      <div className="game-hud" aria-hidden>
        <div className="game-hud__level">
          <span>LV</span>
          <motion.strong key={level} initial={reduce ? false : { scale: 1.6, color: "#fde047" }} animate={{ scale: 1, color: "#ffffff" }} transition={{ duration: 0.4 }}>
            {level}
          </motion.strong>
        </div>
        <div className="game-hud__body">
          <div className="game-hud__zone">{zone}</div>
          <div className="game-hud__bar">
            <div className="game-hud__fill" style={{ width: `${exp}%` }} />
            <div className="game-hud__ticks" />
          </div>
        </div>
        <div className="game-hud__exp">{level >= MAX_LEVEL ? "MAX" : `${exp}%`}</div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="game-toast"
            initial={reduce ? false : { opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <strong>{toast.title}</strong>
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .game-hud {
          position: fixed;
          left: 18px;
          bottom: 18px;
          z-index: 70;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 230px;
          border: 1px solid rgba(250, 204, 21, 0.45);
          border-radius: 12px;
          background: rgba(6, 8, 22, 0.86);
          backdrop-filter: blur(10px);
          padding: 8px 12px 8px 8px;
          box-shadow: 0 0 22px rgba(124, 58, 237, 0.3);
          font-family: var(--font-mono);
          pointer-events: none;
        }

        .game-hud__level {
          display: grid;
          width: 40px;
          height: 40px;
          flex: none;
          place-items: center;
          border: 1px solid rgba(250, 204, 21, 0.7);
          border-radius: 9px;
          background: linear-gradient(145deg, #4c1d95, #1e1b4b);
          line-height: 1;
        }

        .game-hud__level span { color: #fde68a; font-size: 8px; font-weight: 900; letter-spacing: 0.2em; }
        .game-hud__level strong { display: block; margin-top: -8px; color: #fff; font-size: 17px; font-weight: 900; }

        .game-hud__body { min-width: 0; flex: 1; }
        .game-hud__zone { margin-bottom: 5px; color: rgba(226, 232, 240, 0.78); font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; white-space: nowrap; }

        .game-hud__bar { position: relative; height: 9px; overflow: hidden; border-radius: 3px; background: rgba(148, 163, 184, 0.18); }
        .game-hud__fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #fde047); box-shadow: 0 0 12px rgba(250, 204, 21, 0.7); transition: width 0.15s linear; }
        .game-hud__ticks {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(90deg, transparent 0 9px, rgba(6, 8, 22, 0.55) 9px 10px);
        }

        .game-hud__exp { color: #fde68a; font-size: 10px; font-weight: 900; min-width: 28px; text-align: right; }

        .game-toast {
          position: fixed;
          top: 74px;
          left: 50%;
          z-index: 80;
          display: grid;
          gap: 2px;
          translate: -50% 0;
          border: 1px solid rgba(250, 204, 21, 0.8);
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(76, 29, 149, 0.95), rgba(8, 10, 30, 0.95));
          padding: 10px 22px;
          text-align: center;
          box-shadow: 0 0 34px rgba(250, 204, 21, 0.35);
          font-family: var(--font-mono);
          pointer-events: none;
        }

        .game-toast strong { color: #fde047; font-size: 14px; letter-spacing: 0.18em; text-shadow: 0 0 14px rgba(250, 204, 21, 0.7); }
        .game-toast span { color: rgba(226, 232, 240, 0.8); font-size: 11px; }

        @media (max-width: 640px) {
          .game-hud { left: 10px; bottom: 74px; min-width: 0; }
          .game-hud__zone { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .game-hud__fill { transition: none; }
        }
      `}</style>
    </>
  );
}
