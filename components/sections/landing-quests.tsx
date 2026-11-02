"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Coins, Gift, RotateCcw } from "lucide-react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SageSprite } from "@/lib/character-sprites";

// Rewards follow the real app: EASY 25 XP / 10 coins, MEDIUM 60 / 25, HARD 110 / 45.
const QUESTS = [
  { id: 1, title: "Bangun sebelum jam 6", tier: "EASY", rarity: "common", exp: 25, coins: 10 },
  { id: 2, title: "Fokus 25 menit tanpa HP", tier: "MEDIUM", rarity: "rare", exp: 60, coins: 25 },
  { id: 3, title: "Olahraga 15 menit", tier: "HARD", rarity: "epic", exp: 110, coins: 45 },
  { id: 4, title: "Catat pengeluaran hari ini", tier: "EASY", rarity: "common", exp: 25, coins: 10 },
] as const;

const TOTAL_EXP = QUESTS.reduce((sum, quest) => sum + quest.exp, 0);

/** EXP needed to clear a level in this demo (the real app uses its own curve). */
function needFor(level: number) {
  return Math.floor(80 * 1.35 ** (level - 1));
}

function levelFromExp(total: number) {
  let level = 1;
  let left = total;
  while (left >= needFor(level)) {
    left -= needFor(level);
    level += 1;
  }
  return { level, into: left, need: needFor(level) };
}

type Pop = { id: number; questId: number; text: string };

export function LandingQuests() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState<number[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const popId = useRef(0);
  const levelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const earned = useMemo(() => QUESTS.filter((quest) => done.includes(quest.id)), [done]);
  const exp = earned.reduce((sum, quest) => sum + quest.exp, 0) + (chestOpen ? 150 : 0);
  const coins = earned.reduce((sum, quest) => sum + quest.coins, 0) + (chestOpen ? 50 : 0);
  const { level, into, need } = levelFromExp(exp);
  const allDone = done.length === QUESTS.length;

  function complete(questId: number) {
    if (done.includes(questId)) return;
    const quest = QUESTS.find((item) => item.id === questId)!;
    const before = levelFromExp(exp).level;
    const after = levelFromExp(exp + quest.exp).level;

    setDone((value) => [...value, questId]);

    popId.current += 1;
    const id = popId.current;
    setPops((value) => [...value, { id, questId, text: `+${quest.exp} XP  +${quest.coins}` }]);
    setTimeout(() => setPops((value) => value.filter((pop) => pop.id !== id)), 1500);

    if (after > before) {
      setLevelUp(after);
      if (levelTimer.current) clearTimeout(levelTimer.current);
      levelTimer.current = setTimeout(() => setLevelUp(null), 2000);
    }
  }

  function reset() {
    setDone([]);
    setChestOpen(false);
    setLevelUp(null);
    setPops([]);
  }

  return (
    <section className="landing-quests" id="zone-quest">
      <Reveal>
        <div className="zone-heading">
          <div className="zone-eyebrow zone-eyebrow--teal"><span />Stage 02</div>
          <h2>Coba Selesaikan Quest</h2>
          <p>Ini versi mini dari sistemnya. Klik <b>Selesaikan</b> dan lihat EXP, coins, dan level-mu bergerak.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="quest-arena">
          <aside className="quest-player">
            <div className="quest-avatar">
              <SageSprite style={{ width: 96, height: 128 }} />
              <AnimatePresence>
                {levelUp !== null && (
                  <motion.div
                    key={levelUp}
                    className="quest-levelup"
                    initial={{ opacity: 0, scale: 0.4, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: -6 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  >
                    LEVEL UP! → {levelUp}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="quest-lv">
              <span>LEVEL</span>
              <motion.strong key={level} initial={reduce ? false : { scale: 1.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}>
                {level}
              </motion.strong>
            </div>
            <div className="quest-exp">
              <div className="quest-exp__head"><span>EXP</span><b>{into} / {need}</b></div>
              <div className="quest-exp__track">
                <motion.div
                  className="quest-exp__fill"
                  animate={{ width: `${Math.round((into / need) * 100)}%` }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            <div className="quest-coins"><Coins aria-hidden /><AnimatedNumber value={coins} /><span>coins</span></div>
          </aside>

          <div className="quest-board">
            <div className="quest-board__head">
              <b>Quest Hari Ini</b>
              <span>{done.length} / {QUESTS.length}</span>
            </div>

            {QUESTS.map((quest, index) => {
              const finished = done.includes(quest.id);
              const pop = pops.find((item) => item.questId === quest.id);
              return (
                <motion.div
                  key={quest.id}
                  className={`quest-row quest-row--${quest.rarity} ${finished ? "is-done" : ""}`}
                  initial={reduce ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                >
                  <AnimatePresence>
                    {pop && (
                      <motion.div
                        key={pop.id}
                        className="quest-pop"
                        initial={{ opacity: 0, y: 8, scale: 0.8 }}
                        animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1.12 }}
                        transition={{ duration: 1.4, times: [0, 0.15, 0.7, 1] }}
                      >
                        {pop.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="quest-tier">{quest.tier}</span>
                  <span className="quest-title">{quest.title}</span>
                  <span className="quest-reward"><b>+{quest.exp} XP</b> <i>+{quest.coins}</i></span>
                  {finished ? (
                    <motion.span
                      className="quest-check"
                      initial={reduce ? false : { scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <Check aria-hidden />
                    </motion.span>
                  ) : (
                    <motion.button
                      type="button"
                      className="quest-go"
                      whileHover={reduce ? undefined : { scale: 1.07 }}
                      whileTap={reduce ? undefined : { scale: 0.92 }}
                      onClick={() => complete(quest.id)}
                    >
                      Selesaikan
                    </motion.button>
                  )}
                </motion.div>
              );
            })}

            <div className={`quest-chest ${allDone ? "is-ready" : ""} ${chestOpen ? "is-open" : ""}`}>
              <Chest open={chestOpen} />
              <div className="quest-chest__text">
                {!allDone && (
                  <>
                    <b>Peti Harian terkunci</b>
                    <span>Selesaikan semua quest untuk membukanya.</span>
                  </>
                )}
                {allDone && !chestOpen && (
                  <>
                    <b>Peti Harian siap dibuka!</b>
                    <motion.button
                      type="button"
                      className="chest-open"
                      animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      onClick={() => setChestOpen(true)}
                    >
                      <Gift aria-hidden /> Buka Peti
                    </motion.button>
                  </>
                )}
                {chestOpen && (
                  <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <b>+150 XP · +50 coins · Item Epic</b>
                    <span>Total {TOTAL_EXP + 150} XP hari ini. Mau main sungguhan?</span>
                    <div className="chest-actions">
                      <Link href="/login" className="chest-cta">▶ Coba Demo</Link>
                      <button type="button" className="chest-reset" onClick={reset}><RotateCcw aria-hidden /> Ulangi</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <style>{`
        .landing-quests { position: relative; z-index: 1; padding: 20px 0 64px; scroll-margin-top: 80px; }
        .zone-eyebrow--teal { color: #2dd4bf; }
        .zone-eyebrow--teal span { background: #2dd4bf; box-shadow: 0 0 14px rgba(45, 212, 191, 0.7); }

        .quest-arena {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          gap: 22px;
          border: 1px solid rgba(45, 212, 191, 0.4);
          border-radius: 24px;
          background: linear-gradient(160deg, rgba(8, 20, 30, 0.95), rgba(4, 5, 16, 0.98));
          padding: 24px;
          box-shadow: 0 0 50px rgba(20, 184, 166, 0.12);
        }

        .quest-player {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: 18px;
          background: radial-gradient(circle at 50% 28%, rgba(124, 58, 237, 0.3), rgba(8, 10, 28, 0.9) 70%);
          padding: 18px 16px;
        }

        .quest-avatar { position: relative; filter: drop-shadow(0 0 16px rgba(139, 92, 246, 0.7)); }

        .quest-levelup {
          position: absolute;
          left: 50%;
          top: -6px;
          z-index: 5;
          translate: -50% 0;
          white-space: nowrap;
          border-radius: 8px;
          background: #facc15;
          padding: 4px 10px;
          color: #1d1302;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          box-shadow: 0 0 22px rgba(250, 204, 21, 0.8);
        }

        .quest-lv { text-align: center; font-family: var(--font-mono); }
        .quest-lv span { display: block; color: rgba(226, 232, 240, 0.6); font-size: 10px; font-weight: 700; letter-spacing: 0.3em; }
        .quest-lv strong { display: block; color: #facc15; font-size: 40px; font-weight: 900; line-height: 1; text-shadow: 0 0 20px rgba(250, 204, 21, 0.4); }

        .quest-exp { width: 100%; }
        .quest-exp__head { display: flex; justify-content: space-between; margin-bottom: 5px; color: rgba(226, 232, 240, 0.65); font-family: var(--font-mono); font-size: 10px; }
        .quest-exp__head b { color: #fde68a; }
        .quest-exp__track { height: 10px; overflow: hidden; border-radius: 3px; background: rgba(148, 163, 184, 0.18); }
        .quest-exp__fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #fde047); box-shadow: 0 0 14px rgba(250, 204, 21, 0.7); }

        .quest-coins { display: flex; align-items: center; gap: 6px; color: #fcd34d; font-family: var(--font-mono); font-size: 18px; font-weight: 900; }
        .quest-coins svg { width: 18px; height: 18px; }
        .quest-coins span { color: rgba(226, 232, 240, 0.55); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }

        .quest-board { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .quest-board__head { display: flex; justify-content: space-between; color: #fff; font-size: 15px; }
        .quest-board__head span { color: #2dd4bf; font-family: var(--font-mono); font-weight: 800; }

        .quest-row {
          --tone: 148, 163, 184;
          position: relative;
          display: grid;
          grid-template-columns: 62px minmax(0, 1fr) auto auto;
          align-items: center;
          gap: 14px;
          border: 1px solid rgba(var(--tone), 0.35);
          border-radius: 12px;
          background: linear-gradient(90deg, rgba(var(--tone), 0.1), rgba(8, 10, 28, 0.85) 45%);
          padding: 12px 14px;
          transition: border-color 0.3s ease, opacity 0.4s ease, background 0.4s ease;
        }

        .quest-row--common { --tone: 74, 222, 128; }
        .quest-row--rare { --tone: 96, 165, 250; }
        .quest-row--epic { --tone: 192, 132, 252; }
        .quest-row:not(.is-done):hover { border-color: rgba(var(--tone), 0.9); }
        .quest-row.is-done { opacity: 0.72; background: linear-gradient(90deg, rgba(34, 197, 94, 0.14), rgba(8, 10, 28, 0.85) 60%); border-color: rgba(34, 197, 94, 0.5); }
        .quest-row.is-done .quest-title { text-decoration: line-through; text-decoration-color: rgba(255, 255, 255, 0.4); }

        .quest-tier { color: rgb(var(--tone)); font-family: var(--font-mono); font-size: 9px; font-weight: 900; letter-spacing: 0.14em; }
        .quest-title { overflow: hidden; color: #fff; font-size: 14px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .quest-reward { display: flex; gap: 8px; font-family: var(--font-mono); font-size: 11px; white-space: nowrap; }
        .quest-reward b { color: #c4b5fd; }
        .quest-reward i { color: #fcd34d; font-style: normal; font-weight: 700; }

        .quest-go {
          border: 1px solid rgba(34, 197, 94, 0.55);
          border-radius: 9px;
          background: rgba(34, 197, 94, 0.18);
          padding: 7px 14px;
          color: #86efac;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .quest-check { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 9px; background: rgba(34, 197, 94, 0.3); color: #86efac; }
        .quest-check svg { width: 16px; height: 16px; stroke-width: 3; }

        .quest-pop {
          position: absolute;
          right: 70px;
          top: -4px;
          z-index: 6;
          color: #fde047;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 900;
          text-shadow: 0 0 16px rgba(250, 204, 21, 0.85);
          white-space: pre;
          pointer-events: none;
        }

        .quest-chest {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 4px;
          border: 1px dashed rgba(148, 163, 184, 0.35);
          border-radius: 14px;
          padding: 12px 16px;
          transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
        }

        .quest-chest.is-ready { border: 1px solid rgba(250, 204, 21, 0.8); background: rgba(250, 204, 21, 0.06); box-shadow: 0 0 30px rgba(250, 204, 21, 0.25); }
        .quest-chest.is-open { border-color: rgba(192, 132, 252, 0.9); background: rgba(139, 92, 246, 0.1); box-shadow: 0 0 40px rgba(168, 85, 247, 0.3); }
        .quest-chest:not(.is-ready) .chest-svg { filter: grayscale(0.85) brightness(0.7); }

        .chest-svg { width: 92px; flex: none; overflow: visible; }

        .quest-chest__text { display: grid; gap: 4px; min-width: 0; }
        .quest-chest__text > div { display: grid; gap: 4px; }
        .quest-chest__text b { color: #fff; font-size: 14px; }
        .quest-chest__text span { color: rgba(203, 213, 225, 0.65); font-size: 12px; }

        .chest-open, .chest-cta, .chest-reset {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          border-radius: 9px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          text-decoration: none;
        }

        .chest-open { border: 1px solid rgba(255, 226, 122, 0.9); background: linear-gradient(180deg, #ffe178, #d99b1d); color: #1d1302; }
        .chest-open svg, .chest-reset svg { width: 14px; height: 14px; }
        .chest-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
        .chest-cta { border: 1px solid rgba(255, 226, 122, 0.9); background: linear-gradient(180deg, #ffe178, #d99b1d); color: #1d1302; }
        .chest-reset { border: 1px solid rgba(148, 163, 184, 0.4); background: transparent; color: #cbd5e1; }

        @media (max-width: 900px) {
          .quest-arena { grid-template-columns: minmax(0, 1fr); padding: 18px; }
          .quest-player { flex-direction: row; flex-wrap: wrap; justify-content: center; }
          .quest-exp { max-width: 260px; }
        }

        @media (max-width: 640px) {
          .quest-row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 6px; }
          .quest-tier { grid-column: 1 / -1; }
          .quest-reward { grid-column: 1; }
          .quest-go, .quest-check { grid-row: 2 / span 1; grid-column: 2; }
          .quest-pop { right: 20px; }
          .quest-chest { flex-direction: column; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-quests *, .landing-quests *::before, .landing-quests *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}

function Chest({ open }: { open: boolean }) {
  return (
    <svg className="chest-svg" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="chest-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a5a2a" />
          <stop offset="1" stopColor="#4a2610" />
        </linearGradient>
        <linearGradient id="chest-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="chest-burst" cx="50%" cy="100%" r="80%">
          <stop offset="0" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="102" rx="46" ry="6" fill="#000" opacity=".35" />
      {/* light bursting out of the open chest */}
      <ellipse
        cx="60"
        cy="52"
        rx="52"
        ry="46"
        fill="url(#chest-burst)"
        style={{ opacity: open ? 1 : 0, transform: open ? "scale(1)" : "scale(0.3)", transformOrigin: "60px 52px", transition: "all 0.6s ease" }}
      />
      {/* body */}
      <path d="M14 50 L106 50 L102 98 Q60 106 18 98Z" fill="url(#chest-wood)" />
      <path d="M14 50 L106 50 L105 60 L15 60Z" fill="#2a1408" opacity=".5" />
      <path d="M34 50 L34 100 M86 50 L86 100" stroke="url(#chest-gold)" strokeWidth="5" />
      <rect x="52" y="52" width="16" height="18" rx="3" fill="url(#chest-gold)" />
      <circle cx="60" cy="60" r="3" fill="#3b1d06" />
      {/* lid */}
      <g
        style={{
          transformBox: "view-box",
          transformOrigin: "14px 50px",
          transform: open ? "rotate(-72deg)" : "rotate(0deg)",
          transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <path d="M14 50 Q14 14 60 14 Q106 14 106 50Z" fill="url(#chest-wood)" />
        <path d="M34 48 Q34 18 44 16 M86 48 Q86 18 76 16" stroke="url(#chest-gold)" strokeWidth="5" fill="none" />
        <path d="M14 50 L106 50" stroke="url(#chest-gold)" strokeWidth="4" />
      </g>
    </svg>
  );
}
