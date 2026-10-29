"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Flame, Play, Shield, Star, Swords, Zap } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";

const STATS = [
  { icon: Star, to: 12, suffix: "K+", label: "Adventurer" },
  { icon: Zap, to: 848, suffix: "K", label: "Task Diselesaikan" },
  { icon: Flame, to: 96, suffix: "K", label: "Boss Ditaklukkan" },
];

const ENEMIES = ["prokrastinasi", "rasa mager", "distraksi", "kebiasaan buruk"];

// Fixed positions so server and client render the same stars.
const STARS = Array.from({ length: 36 }, (_, index) => ({
  left: (index * 37) % 100,
  top: (index * 53) % 100,
  size: 1 + (index % 3),
  delay: (index % 9) * 0.6,
  duration: 2.4 + (index % 5) * 0.7,
}));

const TITLE_LINE_ONE = ["Hidupmu", "adalah"];
const TITLE_LINE_TWO = ["dungeon", "terkuat", "yang", "pernah", "ada."];

// Damage dealt to the showcase boss, in order. The boss respawns after the last hit.
const BOSS_MAX_HP = 10000;
const HITS = [1500, 2100, 900, 2600, 1700, 1200];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};
const word = {
  hidden: { y: "115%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function LandingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="landing-hero">
      <HeroBackdrop />

      <div className="hero-layout">
        <div className="hero-copy">
          <motion.div
            className="hero-eyebrow"
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span />
            Produktivitas Level RPG
          </motion.div>

          <motion.h1
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
            aria-label="Hidupmu adalah dungeon terkuat yang pernah ada."
          >
            <span className="title-line" aria-hidden>
              {TITLE_LINE_ONE.map((text) => (
                <span key={text} className="word-mask">
                  <motion.span variants={word} className="word">
                    {text}
                  </motion.span>
                </span>
              ))}
            </span>
            <strong className="title-line" aria-hidden>
              {TITLE_LINE_TWO.map((text) => (
                <span key={text} className="word-mask">
                  <motion.span variants={word} className="word shimmer">
                    {text}
                  </motion.span>
                </span>
              ))}
            </strong>
          </motion.h1>

          <motion.p
            className="hero-rotator"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Swords aria-hidden /> Taklukkan <EnemyRotator />
          </motion.p>

          <motion.p
            className="hero-description"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Produktivitasmu bukan daftar tugas kosong. Ia adalah pertarungan melawan boss harian,
            kebiasaan yang naik level, dan identitas yang tumbuh setiap kali kamu menyelesaikan satu
            quest lagi.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Link href="/register" className="gold-cta">
              Pilih Kelasmu <span aria-hidden>{"->"}</span>
            </Link>
            <Link href="/login" className="violet-cta">
              <Play aria-hidden /> Coba Demo
            </Link>
          </motion.div>

          <div className="hero-stats">
            {STATS.map(({ icon: Icon, to, suffix, label }, index) => (
              <motion.div
                key={label}
                className="stat-card"
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.25 + index * 0.1 }}
                whileHover={reduce ? undefined : { y: -4 }}
              >
                <Icon aria-hidden className="stat-icon" />
                <div>
                  <p>
                    <CountUp to={to} suffix={suffix} />
                  </p>
                  <span>{label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <HudShowcase />
      </div>

      <style>{`
        .landing-hero {
          position: relative;
          padding: 46px 0;
        }

        .hero-layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
          gap: 64px;
          align-items: center;
        }

        .hero-copy { min-width: 0; }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          color: #facc15;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.26em;
          text-transform: uppercase;
        }

        .hero-eyebrow span {
          width: 18px;
          height: 2px;
          background: #facc15;
          box-shadow: 0 0 16px rgba(250, 204, 21, 0.7);
          animation: eyebrow-pulse 2.4s ease-in-out infinite;
        }

        .landing-hero h1 {
          margin: 0;
          max-width: 580px;
          color: #fff;
          font-size: 54px;
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: 0;
        }

        .title-line {
          display: block;
          font: inherit;
        }

        .landing-hero h1 strong.title-line { margin-top: 6px; }

        .word-mask {
          display: inline-block;
          overflow: hidden;
          padding-bottom: 0.12em;
          margin-bottom: -0.12em;
          margin-right: 0.26em;
          vertical-align: top;
        }

        .word { display: inline-block; transform-origin: 0 100%; }

        .word.shimmer {
          background: linear-gradient(100deg, #f6c448 20%, #fff3b0 45%, #f6c448 70%);
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gold-shimmer 4.5s linear infinite;
          filter: drop-shadow(0 0 22px rgba(250, 204, 21, 0.22));
        }

        .hero-rotator {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin: 20px 0 0;
          color: #c4b5fd;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .hero-rotator > svg { width: 17px; height: 17px; color: #a855f7; }

        .rotator {
          position: relative;
          display: inline-flex;
          min-width: 150px;
          color: #2dd4bf;
          text-shadow: 0 0 18px rgba(45, 212, 191, 0.5);
        }

        .rotator em { font-style: normal; }

        .rotator::after {
          content: "";
          align-self: center;
          width: 2px;
          height: 1.1em;
          margin-left: 4px;
          background: #2dd4bf;
          animation: caret 1s steps(1) infinite;
        }

        .hero-description {
          margin: 16px 0 0;
          max-width: 520px;
          color: rgba(226, 232, 240, 0.72);
          font-size: 16px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .gold-cta,
        .violet-cta {
          position: relative;
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
          border-radius: 10px;
          padding: 0 28px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .gold-cta {
          border: 1px solid rgba(255, 226, 122, 0.88);
          background: linear-gradient(180deg, #ffe178, #d99b1d);
          color: #1d1302;
          box-shadow: 0 0 24px rgba(250, 204, 21, 0.34);
          animation: cta-glow 3s ease-in-out infinite;
        }

        .gold-cta::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: -60%;
          width: 40%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.65), transparent);
          transform: skewX(-20deg);
          animation: cta-shine 3.6s ease-in-out infinite;
        }

        .gold-cta span { display: inline-block; transition: transform 0.25s ease; }
        .gold-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 36px rgba(250, 204, 21, 0.5); }
        .gold-cta:hover span { transform: translateX(5px); }

        .violet-cta {
          border: 1px solid rgba(139, 92, 246, 0.72);
          background: rgba(12, 10, 28, 0.68);
          color: #d8b4fe;
          box-shadow: inset 0 0 20px rgba(124, 58, 237, 0.08);
        }

        .violet-cta svg { width: 15px; height: 15px; }
        .violet-cta:hover {
          transform: translateY(-3px);
          border-color: #c084fc;
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4), inset 0 0 20px rgba(124, 58, 237, 0.18);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .stat-card {
          display: flex;
          min-height: 76px;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(139, 92, 246, 0.42);
          border-radius: 11px;
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.82), rgba(8, 10, 26, 0.74));
          padding: 14px 16px;
          box-shadow: inset 0 0 24px rgba(124, 58, 237, 0.08);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .stat-card:hover {
          border-color: rgba(192, 132, 252, 0.9);
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.28), inset 0 0 24px rgba(124, 58, 237, 0.14);
        }

        .stat-icon {
          width: 25px;
          height: 25px;
          color: #a855f7;
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.75));
        }

        .stat-card p {
          margin: 0;
          color: #facc15;
          font-family: var(--font-mono);
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
        }

        .stat-card span {
          display: block;
          margin-top: 6px;
          color: rgba(203, 213, 225, 0.5);
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        /* ---------- backdrop ---------- */
        .hero-backdrop {
          position: absolute;
          inset: -60px -40px;
          -webkit-mask-image: linear-gradient(to bottom, black 62%, transparent);
          mask-image: linear-gradient(to bottom, black 62%, transparent);
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
        }

        .orb-a { top: -6%; left: 42%; width: 420px; height: 420px; background: #6d28d9; }
        .orb-b { top: 38%; left: -4%; width: 320px; height: 320px; background: #0d9488; opacity: 0.32; }
        .orb-c { bottom: -8%; right: 6%; width: 340px; height: 340px; background: #be185d; opacity: 0.26; }

        .star {
          position: absolute;
          border-radius: 50%;
          background: #e9d5ff;
          opacity: 0.2;
          animation: twinkle ease-in-out infinite;
        }

        /* ---------- HUD ---------- */
        .hero-hud-wrap {
          position: relative;
          min-width: 0;
          perspective: 1100px;
        }

        .hero-hud-wrap::before {
          content: "";
          position: absolute;
          inset: -52px -34px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 50% 8%, rgba(124, 58, 237, 0.38), transparent 42%),
            radial-gradient(circle at 20% 86%, rgba(20, 184, 166, 0.13), transparent 30%);
          filter: blur(8px);
          animation: aura 6s ease-in-out infinite;
        }

        .hud-frame {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(139, 92, 246, 0.86);
          border-radius: 28px;
          background:
            linear-gradient(135deg, rgba(30, 27, 75, 0.88), rgba(2, 6, 23, 0.94) 52%, rgba(6, 8, 22, 0.96)),
            rgba(2, 6, 23, 0.98);
          padding: 42px;
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.17),
            0 0 50px rgba(124, 58, 237, 0.34),
            inset 0 0 44px rgba(124, 58, 237, 0.13);
        }

        .hud-frame::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(139, 92, 246, 0.28);
          border-radius: 20px;
          pointer-events: none;
        }

        .hud-frame::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -30%;
          height: 30%;
          background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.12), transparent);
          animation: scan 5.5s linear infinite;
          pointer-events: none;
        }

        .hud-corner {
          position: absolute;
          top: 0;
          width: 140px;
          height: 34px;
          border-top: 3px solid #8b5cf6;
          filter: drop-shadow(0 0 14px rgba(139, 92, 246, 0.95));
        }

        .hud-corner-left { left: 74px; transform: skewX(-36deg); }
        .hud-corner-right { right: 74px; transform: skewX(36deg); }

        .hud-top {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .hud-top span,
        .hud-bar-head span {
          color: rgba(226, 232, 240, 0.68);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .hud-top strong {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #facc15;
          font-family: var(--font-mono);
          font-size: 54px;
          font-weight: 900;
          line-height: 1;
          text-shadow: 0 0 24px rgba(250, 204, 21, 0.24);
        }

        .hud-streak { text-align: right; }
        .hud-streak strong { color: #f5d0fe; font-size: 34px; justify-content: flex-end; }
        .hud-streak svg {
          width: 28px;
          height: 28px;
          color: #fb7185;
          transform-origin: 50% 90%;
          animation: flame 1.3s ease-in-out infinite;
        }

        .hud-bars { position: relative; z-index: 1; display: grid; gap: 18px; }
        .hud-bar-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .hud-track { height: 8px; overflow: hidden; border-radius: 999px; background: rgba(148, 163, 184, 0.16); }
        .hud-fill { height: 100%; border-radius: inherit; transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .hud-fill.gold { background: linear-gradient(90deg, #f59e0b, #fde047); box-shadow: 0 0 16px rgba(250, 204, 21, 0.58); }
        .hud-fill.teal { background: linear-gradient(90deg, #14b8a6, #5eead4); box-shadow: 0 0 16px rgba(45, 212, 191, 0.5); }

        .boss-card {
          position: relative;
          z-index: 1;
          margin-top: 28px;
          border: 1px solid rgba(244, 114, 182, 0.48);
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(244, 114, 182, 0.09), rgba(15, 23, 42, 0.74));
          padding: 18px;
        }

        .boss-row { display: flex; align-items: center; gap: 16px; }

        .boss-mark {
          display: grid;
          width: 52px;
          height: 52px;
          flex: none;
          place-items: center;
          border: 1px solid rgba(244, 114, 182, 0.55);
          border-radius: 14px;
          background: rgba(244, 114, 182, 0.12);
          color: #f9a8d4;
          box-shadow: 0 0 22px rgba(244, 114, 182, 0.28);
        }

        .boss-mark svg { width: 26px; height: 26px; }
        .boss-info { min-width: 0; flex: 1; }
        .boss-info p { margin: 0; color: #fff; font-size: 15px; font-weight: 800; }
        .boss-info span { color: rgba(226, 232, 240, 0.6); font-family: var(--font-mono); font-size: 12px; }
        .boss-reward { color: #f9a8d4; font-size: 12px; font-weight: 800; white-space: nowrap; }

        .boss-hp { margin-top: 14px; height: 10px; overflow: hidden; border-radius: 999px; background: rgba(244, 63, 94, 0.14); }
        .boss-hp div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #e11d48, #fb7185);
          box-shadow: 0 0 16px rgba(251, 113, 133, 0.6);
          transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .damage-pop {
          position: absolute;
          right: 22px;
          top: -4px;
          z-index: 3;
          color: #fde047;
          font-family: var(--font-mono);
          font-size: 24px;
          font-weight: 900;
          text-shadow: 0 0 16px rgba(250, 204, 21, 0.8);
          pointer-events: none;
        }

        .damage-pop.crit { color: #fb7185; font-size: 30px; text-shadow: 0 0 18px rgba(251, 113, 133, 0.9); }

        .victory {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: grid;
          place-items: center;
          border-radius: 28px;
          background: rgba(8, 6, 24, 0.72);
          backdrop-filter: blur(3px);
          text-align: center;
        }

        .victory strong { display: block; color: #facc15; font-family: var(--font-mono); font-size: 26px; letter-spacing: 0.14em; text-shadow: 0 0 24px rgba(250, 204, 21, 0.7); }
        .victory span { display: block; margin-top: 8px; color: #c4b5fd; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.12em; }

        .spark {
          position: absolute;
          z-index: 2;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #facc15;
          box-shadow: 0 0 12px #facc15;
          animation: rise 5s ease-in infinite;
        }

        /* ---------- keyframes ---------- */
        @keyframes gold-shimmer { to { background-position: -220% 0; } }
        @keyframes caret { 50% { opacity: 0; } }
        @keyframes eyebrow-pulse { 50% { width: 34px; } }
        @keyframes cta-glow { 50% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.55); } }
        @keyframes cta-shine { 0%, 55% { left: -60%; } 100% { left: 140%; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.5); } }
        @keyframes aura { 50% { opacity: 0.65; transform: scale(1.04); } }
        @keyframes scan { to { top: 130%; } }
        @keyframes flame { 0%, 100% { transform: scale(1) rotate(-3deg); } 50% { transform: scale(1.14) rotate(4deg); } }
        @keyframes rise { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: translateY(-150px) scale(0.3); opacity: 0; } }

        @media (max-width: 1020px) {
          .hero-layout { grid-template-columns: minmax(0, 1fr); gap: 52px; }
          .landing-hero h1 { font-size: 46px; }
        }

        @media (max-width: 640px) {
          .landing-hero { padding-top: 28px; }
          .landing-hero h1 { font-size: 36px; }
          .hero-stats { grid-template-columns: 1fr; }
          .hud-frame { padding: 30px 22px; }
          .hud-top strong { font-size: 42px; }
          .boss-reward { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-hero *, .landing-hero *::before, .landing-hero *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function EnemyRotator() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => setIndex((value) => (value + 1) % ENEMIES.length), 2400);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <span className="rotator" aria-live="off">
      <AnimatePresence mode="wait">
        <motion.em
          key={ENEMIES[index]}
          initial={reduce ? false : { y: 16, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -16, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.35 }}
        >
          {ENEMIES[index]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

function HeroBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div className="hero-backdrop" aria-hidden>
      <motion.div
        className="orb orb-a"
        animate={reduce ? undefined : { x: [0, 60, -30, 0], y: [0, 40, 70, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-b"
        animate={reduce ? undefined : { x: [0, -40, 50, 0], y: [0, 60, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-c"
        animate={reduce ? undefined : { x: [0, 50, -50, 0], y: [0, -50, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {STARS.map((star, index) => (
        <span
          key={index}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function HudShowcase() {
  const reduce = useReducedMotion();

  // Mouse tilt
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 18 });

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  // Looping boss fight: one hit per tick, then a victory banner, then respawn.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => setStep((value) => (value >= HITS.length ? 0 : value + 1)), 2000);
    return () => clearInterval(timer);
  }, [reduce]);

  const dealt = HITS.slice(0, step).reduce((sum, hit) => sum + hit, 0);
  const hp = Math.max(0, BOSS_MAX_HP - dealt);
  const defeated = step >= HITS.length;
  const lastHit = step > 0 ? HITS[step - 1] : 0;
  const isCrit = lastHit >= 2000;
  const exp = Math.min(100, 40 + step * 10);
  const focus = Math.max(30, 82 - step * 6);

  return (
    <motion.div
      className="hero-hud-wrap"
      initial={reduce ? false : { opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}>
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="hud-frame">
            <div className="hud-corner hud-corner-left" />
            <div className="hud-corner hud-corner-right" />

            {[18, 46, 74].map((left, index) => (
              <i
                key={left}
                className="spark"
                style={{ left: `${left}%`, bottom: 24, animationDelay: `${index * 1.6}s` }}
              />
            ))}

            <div className="hud-top">
              <div>
                <span>Level</span>
                <strong>{24 + (defeated ? 1 : 0)}</strong>
              </div>
              <div className="hud-streak">
                <span>Streak</span>
                <strong>
                  <Flame aria-hidden />
                  26
                </strong>
              </div>
            </div>

            <div className="hud-bars">
              <HudBar label="EXP" value={exp} tone="gold" />
              <HudBar label="HP Fokus" value={focus} tone="teal" />
            </div>

            <div className="boss-card">
              <AnimatePresence>
                {step > 0 && !defeated && (
                  <motion.div
                    key={step}
                    className={`damage-pop${isCrit ? " crit" : ""}`}
                    initial={{ opacity: 0, y: 8, scale: 0.7 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -34, scale: isCrit ? 1.25 : 1 }}
                    transition={{ duration: 1.5, times: [0, 0.15, 0.7, 1] }}
                  >
                    {isCrit ? "CRIT " : ""}-{lastHit.toLocaleString("id")}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="boss-row">
                <motion.div
                  key={`mark-${step}`}
                  className="boss-mark"
                  animate={step > 0 && !defeated && !reduce ? { x: [0, -7, 7, -4, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Shield aria-hidden />
                </motion.div>
                <div className="boss-info">
                  <p>Prokrastinator Agung</p>
                  <span>
                    {hp.toLocaleString("id")} / {BOSS_MAX_HP.toLocaleString("id")} HP
                  </span>
                </div>
                <strong className="boss-reward">Hadiah: 1x Epic</strong>
              </div>
              <div className="boss-hp">
                <div style={{ width: `${(hp / BOSS_MAX_HP) * 100}%` }} />
              </div>
            </div>

            <AnimatePresence>
              {defeated && (
                <motion.div
                  className="victory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  >
                    <strong>BOSS DEFEATED</strong>
                    <span>+500 EXP · +250 COINS · LEVEL UP</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function HudBar({ label, value, tone }: { label: string; value: number; tone: "gold" | "teal" }) {
  return (
    <div>
      <div className="hud-bar-head">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="hud-track">
        <div className={`hud-fill ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
