"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  username: string;
  streak: number;
  characterCard: ReactNode;
  dailyQuests: ReactNode;
  bossBattlePreview: ReactNode;
  habitCalendar: ReactNode;
  weeklyChallenges: ReactNode;
  statsOverview: ReactNode;
  recentAchievements: ReactNode;
  questsDetail: ReactNode;
  battleDetail: ReactNode;
  statusDetail: ReactNode;
  vaultDetail?: ReactNode;
  oracleDetail: ReactNode;
  arenaDetail: ReactNode;
  guildDetail: ReactNode;
  inventoryDetail?: ReactNode;
  shopDetail?: ReactNode;
  achievementsDetail?: ReactNode;
};

type View = "dashboard" | "quests" | "battle" | "status" | "vault" | "oracle" | "arena" | "guild" | "inventory" | "shop" | "achievements";

const HASH_MAP: Record<string, View> = {
  "": "dashboard",
  mission: "quests",
  battle: "battle",
  status: "status",
  vault: "vault",
  oracle: "oracle",
  arena: "arena",
  guild: "guild",
  inventory: "inventory",
  shop: "shop",
  achievements: "achievements",
};

const DETAIL_META: Partial<Record<View, { label: string; desc: string; accent: string }>> = {
  quests:       { label: "Quests",         desc: "Habit board, daily rituals, and custom mission CRUD.", accent: "#22d3ee" },
  battle:       { label: "Battle Mode",    desc: "Boss raids, dungeon runs, and focus combat.",          accent: "#f43f5e" },
  status:       { label: "Profile",        desc: "Character card, stats, habits, and goals.",            accent: "#a78bfa" },
  vault:        { label: "Vault",          desc: "Inventory, achievements, and shop.",                   accent: "#f59e0b" },
  oracle:       { label: "Ranking",        desc: "Leaderboard, analytics, and coach insight.",           accent: "#facc15" },
  arena:        { label: "Arena",          desc: "PvP preview and competitive systems.",                 accent: "#fb7185" },
  guild:        { label: "Guild",          desc: "Friends, requests, and party activity.",               accent: "#34d399" },
  inventory:    { label: "Inventory",      desc: "Your equipped relics and collected items.",            accent: "#60a5fa" },
  shop:         { label: "Shop",           desc: "Spend coins on boosts and items.",                     accent: "#f59e0b" },
  achievements: { label: "Achievements",   desc: "Your unlocked milestones and codex.",                  accent: "#c084fc" },
};

function greetingForHour(hour: number) {
  if (hour < 4) return "Masih terjaga";
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

const EASE = [0.22, 1, 0.36, 1] as const;

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cellVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

const gridVariantsLate = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
};

// Defined at module level so the cells keep their identity (and their animation state) across renders.
function Cell({ children }: { children: ReactNode }) {
  return (
    <motion.div className="dash-cell" variants={cellVariants} style={{ display: "grid", minWidth: 0 }}>
      {children}
    </motion.div>
  );
}

export function DashboardContentRouter({
  username, streak,
  characterCard, dailyQuests, bossBattlePreview,
  habitCalendar, weeklyChallenges, statsOverview, recentAchievements,
  questsDetail, battleDetail, statusDetail, vaultDetail, oracleDetail, arenaDetail, guildDetail,
  inventoryDetail, shopDetail, achievementsDetail,
}: Props) {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("dashboard");
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const update = () => {
      const hash = window.location.hash.replace("#", "");
      setView(HASH_MAP[hash] ?? "dashboard");
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  // Time of day is only known in the browser, so it is filled in after hydration.
  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  const panels: Partial<Record<View, ReactNode>> = {
    quests:       questsDetail,
    battle:       battleDetail,
    status:       statusDetail,
    vault:        vaultDetail,
    oracle:       oracleDetail,
    arena:        arenaDetail,
    guild:        guildDetail,
    inventory:    inventoryDetail ?? vaultDetail,
    shop:         shopDetail ?? vaultDetail,
    achievements: achievementsDetail ?? vaultDetail,
  };

  const meta = DETAIL_META[view] ?? { label: String(view), desc: "", accent: "#a78bfa" };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {view === "dashboard" ? (
        <motion.div
          key="dashboard"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{greeting},</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="dash-name">{username}</span>
              {streak > 0 && <span className="dash-streak-chip">🔥 {streak} hari</span>}
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              Level up your habits. Level up your life.
            </p>
          </motion.div>

          <motion.div
            className="dashboard-panel-grid"
            variants={gridVariants}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}
          >
            <Cell>{characterCard}</Cell>
            <Cell>{dailyQuests}</Cell>
            <Cell>{bossBattlePreview}</Cell>
          </motion.div>

          <motion.div
            className="dashboard-panel-grid"
            variants={gridVariantsLate}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}
          >
            <Cell>{habitCalendar}</Cell>
            <Cell>{weeklyChallenges}</Cell>
            <motion.div variants={cellVariants} style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
              <div className="dash-cell">{statsOverview}</div>
              <div className="dash-cell">{recentAchievements}</div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key={view}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 32 }}
        >
          <div
            className="dashboard-detail-header"
            style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0b0f18", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 20px" }}
          >
            <motion.span
              aria-hidden
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ position: "absolute", left: 0, top: 0, height: 2, width: "100%", transformOrigin: "0 50%", background: `linear-gradient(90deg, ${meta.accent}, transparent)` }}
            />
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: meta.accent, opacity: 0.85 }}>{meta.label}</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 4 }}>{meta.label}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{meta.desc}</p>
            </div>
            <motion.button
              type="button"
              className="dash-back"
              whileHover={reduce ? undefined : { x: -3 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              onClick={() => { window.location.hash = ""; window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              ← Dashboard
            </motion.button>
          </div>
          {panels[view]}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
