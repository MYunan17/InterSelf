"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IroncladSprite, MerchantSprite, PhantomSprite, SageSprite, CLASS_COLORS, type SpriteProps } from "@/lib/character-sprites";
import { Reveal } from "@/components/motion/reveal";

type ClassId = "SAGE" | "IRONCLAD" | "PHANTOM" | "MERCHANT";

type Showcase = {
  id: ClassId;
  name: string;
  role: string;
  tagline: string;
  passive: string;
  Sprite: (props: SpriteProps) => React.JSX.Element;
  stats: { label: string; value: number }[];
};

const STAT_LABELS = ["Disiplin", "Intelek", "Fokus", "Fisik", "Finansial", "Konsisten"] as const;

// Mirrors the starting stats and passives defined in lib/classes.ts (base 10 + class bonus).
function stats(bonus: Partial<Record<(typeof STAT_LABELS)[number], number>>) {
  return STAT_LABELS.map((label) => ({ label, value: 10 + (bonus[label] ?? 0) }));
}

const CLASSES: Showcase[] = [
  {
    id: "SAGE",
    name: "Sage",
    role: "Penguasa Ilmu",
    tagline: "Setiap buku adalah senjata.",
    passive: "+15% EXP dari task STUDY dan FOCUS",
    Sprite: SageSprite,
    stats: stats({ Intelek: 20, Fokus: 15 }),
  },
  {
    id: "IRONCLAD",
    name: "Ironclad",
    role: "Prajurit Disiplin",
    tagline: "Tidak kenal lelah.",
    passive: "+15% EXP dari task HARD dan LEGENDARY",
    Sprite: IroncladSprite,
    stats: stats({ Disiplin: 20, Fisik: 15 }),
  },
  {
    id: "PHANTOM",
    name: "Phantom",
    role: "Bayangan Konsisten",
    tagline: "Selalu ada, tidak pernah berhenti.",
    passive: "Streak putus hanya terpotong 50%, tidak reset ke 0",
    Sprite: PhantomSprite,
    stats: stats({ Konsisten: 20, Fokus: 10 }),
  },
  {
    id: "MERCHANT",
    name: "Merchant",
    role: "Pemburu Reward",
    tagline: "Setiap misi adalah investasi.",
    passive: "+20% Coins dari semua task",
    Sprite: MerchantSprite,
    stats: stats({ Finansial: 20, Konsisten: 10 }),
  },
];

export function LandingClasses() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const current = CLASSES[index]!;
  const color = CLASS_COLORS[current.id] ?? CLASS_COLORS.DEFAULT!;

  // Arrow keys move the selection like a character-select screen.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((value) => (value + 1) % CLASSES.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((value) => (value - 1 + CLASSES.length) % CLASSES.length);
    }
  }

  return (
    <section className="landing-classes" id="zone-class">
      <Reveal>
        <div className="zone-heading">
          <div className="zone-eyebrow"><span />Stage 01</div>
          <h2>Pilih Kelasmu</h2>
          <p>Setiap kelas punya gaya main dan bonus pasif sendiri. Pilih yang paling cocok dengan hidupmu.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="select-screen"
          style={{ ["--cls-main" as string]: color.primary, ["--cls-glow" as string]: color.glow, ["--cls-accent" as string]: color.accent } as React.CSSProperties}
        >
          <div className="select-roster" role="radiogroup" aria-label="Pilih kelas" onKeyDown={onKeyDown}>
            {CLASSES.map((item, position) => {
              const active = position === index;
              const palette = CLASS_COLORS[item.id] ?? CLASS_COLORS.DEFAULT!;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  className={`roster-slot ${active ? "is-active" : ""}`}
                  style={{ ["--slot" as string]: palette.glow } as React.CSSProperties}
                  onClick={() => setIndex(position)}
                  onMouseEnter={() => setIndex(position)}
                >
                  <span className="roster-portrait"><item.Sprite style={{ width: 52, height: 68 }} /></span>
                  <span className="roster-name">{item.name}</span>
                  {active && <motion.i layoutId="roster-cursor" className="roster-cursor" aria-hidden />}
                </button>
              );
            })}
            <p className="roster-hint">Tekan panah atau arahkan kursor</p>
          </div>

          <div className="select-stage">
            <div className="stage-circle" />
            <div className="stage-circle stage-circle--inner" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="stage-hero"
                initial={reduce ? false : { opacity: 0, y: 26, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.95 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <current.Sprite style={{ width: 230, height: 306 }} />
              </motion.div>
            </AnimatePresence>
            {[18, 36, 62, 80].map((left, i) => (
              <i key={left} className="stage-dust" style={{ left: `${left}%`, animationDelay: `${i * 0.8}s` }} />
            ))}
          </div>

          <div className="select-info">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="info-role">{current.role}</div>
                <h3>{current.name}</h3>
                <p className="info-tagline">&ldquo;{current.tagline}&rdquo;</p>

                <div className="info-stats">
                  {current.stats.map((stat, i) => (
                    <div key={stat.label} className="stat-row">
                      <span>{stat.label}</span>
                      <div className="stat-track">
                        <motion.div
                          className="stat-fill"
                          initial={reduce ? false : { width: 0 }}
                          animate={{ width: `${Math.min(100, stat.value * 2.6)}%` }}
                          transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <b>{stat.value}</b>
                    </div>
                  ))}
                </div>

                <div className="info-passive"><em>PASIF</em>{current.passive}</div>
              </motion.div>
            </AnimatePresence>

            <Link href="/register" className="select-go">
              ▶ Mulai sebagai {current.name}
            </Link>
          </div>
        </div>
      </Reveal>

      <style>{`
        .landing-classes { position: relative; z-index: 1; padding: 20px 0 64px; scroll-margin-top: 80px; }

        .zone-heading { max-width: 560px; margin-bottom: 30px; }
        .zone-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          color: #facc15;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }
        .zone-eyebrow span { width: 20px; height: 2px; background: #facc15; box-shadow: 0 0 14px rgba(250, 204, 21, 0.7); }
        .zone-heading h2 { margin: 0; color: #fff; font-size: 40px; font-weight: 900; line-height: 1.12; }
        .zone-heading p { margin: 12px 0 0; color: rgba(203, 213, 225, 0.66); font-size: 16px; line-height: 1.7; }

        .select-screen {
          position: relative;
          display: grid;
          grid-template-columns: 150px minmax(0, 1.1fr) minmax(300px, 0.9fr);
          gap: 28px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--cls-glow) 55%, transparent);
          border-radius: 24px;
          background:
            radial-gradient(circle at 50% 70%, color-mix(in srgb, var(--cls-main) 30%, transparent), transparent 60%),
            linear-gradient(160deg, rgba(14, 12, 40, 0.95), rgba(4, 5, 16, 0.98));
          padding: 28px;
          box-shadow: 0 0 60px color-mix(in srgb, var(--cls-glow) 20%, transparent);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .select-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(255, 255, 255, 0.018) 3px 4px);
          pointer-events: none;
        }

        .select-roster { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; }

        .roster-slot {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          background: rgba(8, 10, 28, 0.8);
          padding: 6px 10px 6px 6px;
          color: rgba(226, 232, 240, 0.7);
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .roster-slot:hover { transform: translateX(4px); }
        .roster-slot.is-active { border-color: var(--slot); color: #fff; box-shadow: 0 0 22px color-mix(in srgb, var(--slot) 40%, transparent); }
        .roster-slot:focus-visible { outline: 2px solid var(--slot); outline-offset: 2px; }

        .roster-portrait {
          display: grid;
          width: 52px;
          height: 62px;
          flex: none;
          place-items: end center;
          overflow: hidden;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.4);
        }

        .roster-name { font-family: var(--font-mono); font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
        .roster-cursor {
          position: absolute;
          left: -3px;
          top: 50%;
          width: 6px;
          height: 24px;
          translate: 0 -50%;
          border-radius: 3px;
          background: var(--slot);
          box-shadow: 0 0 12px var(--slot);
        }

        .roster-hint { margin: 6px 0 0; color: rgba(148, 163, 184, 0.6); font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.08em; line-height: 1.5; text-transform: uppercase; }

        .select-stage { position: relative; z-index: 1; display: grid; min-height: 380px; place-items: end center; }

        .stage-circle {
          position: absolute;
          bottom: 6px;
          width: 300px;
          height: 74px;
          border: 2px solid color-mix(in srgb, var(--cls-accent) 55%, transparent);
          border-radius: 50%;
          box-shadow: 0 0 34px color-mix(in srgb, var(--cls-glow) 55%, transparent), inset 0 0 26px color-mix(in srgb, var(--cls-glow) 35%, transparent);
          animation: select-pulse 3s ease-in-out infinite;
        }

        .stage-circle--inner { width: 210px; height: 48px; bottom: 19px; animation-delay: -1.5s; opacity: 0.7; }

        .stage-hero { position: relative; margin-bottom: 26px; filter: drop-shadow(0 0 26px color-mix(in srgb, var(--cls-glow) 65%, transparent)); }

        .stage-dust {
          position: absolute;
          bottom: 60px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--cls-accent);
          box-shadow: 0 0 10px var(--cls-accent);
          opacity: 0;
          animation: select-rise 4.4s ease-in infinite;
        }

        .select-info { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; min-width: 0; }
        .info-role { color: var(--cls-accent); font-family: var(--font-mono); font-size: 10px; font-weight: 900; letter-spacing: 0.28em; text-transform: uppercase; }
        .select-info h3 { margin: 6px 0 0; color: #fff; font-size: 34px; font-weight: 900; line-height: 1.05; text-shadow: 0 0 24px color-mix(in srgb, var(--cls-glow) 70%, transparent); }
        .info-tagline { margin: 8px 0 0; color: rgba(203, 213, 225, 0.72); font-size: 14px; font-style: italic; }

        .info-stats { display: grid; gap: 9px; margin-top: 20px; }
        .stat-row { display: grid; grid-template-columns: 74px minmax(0, 1fr) 26px; align-items: center; gap: 10px; }
        .stat-row span { color: rgba(203, 213, 225, 0.62); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
        .stat-row b { color: #fff; font-family: var(--font-mono); font-size: 11px; text-align: right; }
        .stat-track { height: 8px; overflow: hidden; border-radius: 2px; background: rgba(148, 163, 184, 0.16); }
        .stat-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--cls-main), var(--cls-accent));
          box-shadow: 0 0 12px color-mix(in srgb, var(--cls-glow) 70%, transparent);
        }

        .info-passive {
          margin-top: 18px;
          border: 1px solid color-mix(in srgb, var(--cls-accent) 40%, transparent);
          border-radius: 10px;
          background: color-mix(in srgb, var(--cls-main) 14%, transparent);
          padding: 10px 12px;
          color: #fff;
          font-size: 13px;
          line-height: 1.5;
        }

        .info-passive em {
          display: inline-block;
          margin-right: 8px;
          border-radius: 4px;
          background: var(--cls-accent);
          padding: 1px 6px;
          color: #0b0b18;
          font-family: var(--font-mono);
          font-size: 9px;
          font-style: normal;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .select-go {
          position: relative;
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 226, 122, 0.88);
          border-radius: 10px;
          background: linear-gradient(180deg, #ffe178, #d99b1d);
          color: #1d1302;
          font-size: 15px;
          font-weight: 900;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .select-go:hover { transform: translateY(-3px); box-shadow: 0 10px 34px rgba(250, 204, 21, 0.5); }

        @keyframes select-pulse { 50% { transform: scale(1.06); opacity: 0.7; } }
        @keyframes select-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(-190px) scale(0.3); opacity: 0; }
        }

        @media (max-width: 1000px) {
          .select-screen { grid-template-columns: minmax(0, 1fr); padding: 20px; }
          .select-roster { flex-direction: row; flex-wrap: wrap; }
          .roster-hint { display: none; }
          .select-stage { min-height: 330px; }
        }

        @media (max-width: 640px) {
          .zone-heading h2 { font-size: 30px; }
          .roster-slot { flex: 1 1 calc(50% - 10px); }
          .stage-circle { width: 240px; }
          .stage-hero svg { width: 190px !important; height: 253px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-classes *, .landing-classes *::before, .landing-classes *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
