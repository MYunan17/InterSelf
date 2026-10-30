"use client";

import { useEffect, useState } from "react";
import { BossArt, getBossTheme } from "@/lib/boss-sprites";

type BossState = {
  boss?: {
    name?: string;
    level?: number;
    maxHp?: number;
    weakness?: string | null;
  } | null;
  progress?: {
    currentHp?: number;
  } | null;
  bossName?: string;
  bossLevel?: number;
  currentHp?: number;
  maxHp?: number;
  weeklyDamage?: number;
};

const CATEGORY_LABEL: Record<string, string> = {
  WAKE_UP: "Morning",
  STUDY: "Study",
  WORKOUT: "Workout",
  SAVE_MONEY: "Finance",
  FOCUS: "Focus",
  CUSTOM: "Custom",
};

export function BossBattlePreview({ productivityCompletion = 0 }: { productivityCompletion?: number }) {
  const [state, setState] = useState<BossState | null>(null);

  useEffect(() => {
    fetch("/api/boss/state", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setState(d))
      .catch(() => {});
  }, []);

  const bossName = state?.boss?.name ?? state?.bossName ?? "Procrastination Demon";
  const bossLevel = state?.boss?.level ?? state?.bossLevel ?? 25;
  const maxHp = state?.boss?.maxHp ?? state?.maxHp ?? 10000;
  const currentHp = state?.progress?.currentHp ?? state?.currentHp ?? 7450;
  const weakness = state?.boss?.weakness ? (CATEGORY_LABEL[state.boss.weakness] ?? state.boss.weakness) : "Any habit";
  const theme = getBossTheme(bossName);
  const hpPercent = maxHp > 0 ? Math.round((currentHp / maxHp) * 100) : 74;
  const damage = state?.weeklyDamage ?? Math.max(2550, productivityCompletion * 25);

  return (
    <div style={{
      position: "relative", display: "flex", flexDirection: "column",
      overflow: "hidden", borderRadius: 16, border: "1px solid rgba(239,68,68,0.18)",
      background: "linear-gradient(160deg, #1c0810 0%, #0e0814 50%, #080b15 100%)",
      minHeight: 440,
    }}>
      {/* Aura */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 35%, color-mix(in srgb, ${theme.main} 24%, transparent) 0%, transparent 60%)`, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 900, color: "#fff" }}>
          <span>⚔️</span><span>Boss Battle</span>
        </div>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", cursor: "pointer" }}>?</span>
      </div>

      {/* Boss name */}
      <div style={{ position: "relative", textAlign: "center", padding: "4px 16px 0" }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: theme.main, textShadow: `0 0 18px ${theme.glow}88` }}>{bossName}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Level {bossLevel} Boss</div>
        <div style={{ display: "inline-flex", marginTop: 7, border: "1px solid rgba(251,191,36,0.28)", borderRadius: 999, background: "rgba(251,191,36,0.08)", padding: "3px 8px", color: "#fcd34d", fontSize: 9, fontWeight: 800 }}>
          Weak vs {weakness}
        </div>
      </div>

      {/* Boss SVG — contained, no overflow */}
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
        <BossArt name={bossName} size="min(80%, 240px)" />
      </div>

      {/* HP bar */}
      <div style={{ position: "relative", padding: "0 16px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, fontSize: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Boss HP</span>
          <span style={{ fontWeight: 700, color: "#f87171" }}>{currentHp.toLocaleString()} / {maxHp.toLocaleString()}</span>
          <span style={{ fontWeight: 900, color: "#f87171" }}>{hpPercent}%</span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${hpPercent}%`, background: "linear-gradient(90deg, #dc2626, #ef4444)", borderRadius: 4 }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px 10px" }}>
        <div style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>⚡ Damage Dealt</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{damage.toLocaleString()}</div>
        </div>
        <div style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Rewards</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>+500 XP</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b" }}>🪙+200</span>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", padding: "0 16px 10px", fontSize: 10, color: "rgba(255,255,255,0.38)" }}>
        Daily completion feeds boss damage: {productivityCompletion}%
      </div>

      {/* Button */}
      <div style={{ position: "relative", padding: "0 16px 16px" }}>
        <button type="button"
          style={{ width: "100%", background: "#dc2626", border: "none", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 900, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          onClick={() => { window.location.hash = "battle"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          ⚔️ View Battle
        </button>
      </div>
    </div>
  );
}
