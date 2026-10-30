"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BossArt } from "@/lib/boss-sprites";
import { useToast } from "@/components/ui/toast";
import { subscribeToBossDamage, subscribeToTasksUpdate } from "@/lib/events";
import { fetchCachedJson, getCachedJson } from "@/lib/panel-data-cache";

// API returns: { boss: { name, level, maxHp, rewardExp, rewardCoins, weakness? }, progress: { currentHp, id }, cooldownRemainingMs, percentageRemaining }
type ApiResponse = {
  boss: { id: number; name: string; level?: number; maxHp: number; rewardExp: number; rewardCoins: number; weakness?: string | null; flavorText?: string | null } | null;
  progress: { id: number; currentHp: number; status?: string } | null;
  cooldownRemainingMs: number;
  percentageRemaining: number | null;
};

type EnergyResponse = { energy: number; energyMax: number };
type BossAttackResponse = {
  damageApplied?: number;
  defeated?: boolean;
  energy?: number;
  progress?: { currentHp?: number };
};

type LogEntry = { msg: string; type: "damage" | "info" | "crit" | "warning"; ts: number };

type Strike = {
  id: string; name: string; desc: string;
  baseDamage: number; critChance: number;
  cooldown: number; cost: number; color: string;
};

const STRIKES: Strike[] = [
  { id: "basic",      name: "Basic Strike",     desc: "Reliable attack",   baseDamage: 80,  critChance: 0.1,  cooldown: 8,  cost: 10, color: "#22d3ee" },
  { id: "focus",      name: "Focus Slash",      desc: "+15% damage",       baseDamage: 140, critChance: 0.18, cooldown: 20, cost: 20, color: "#8b5cf6" },
  { id: "discipline", name: "Discipline Break", desc: "Shreds defenses",   baseDamage: 200, critChance: 0.22, cooldown: 35, cost: 35, color: "#f59e0b" },
  { id: "nova",       name: "Awakening Nova",   desc: "Massive burst",     baseDamage: 420, critChance: 0.3,  cooldown: 60, cost: 60, color: "#f87171" },
];

const LOG_MAX = 10;

// Boss narration lines
const NARRATIONS: Record<string, string[]> = {
  idle:    ["The demon stares at you with glowing eyes...", "You feel its presence weighing on your mind.", "It feeds on your procrastination."],
  hit:     ["The boss recoils!", "It screeches in pain!", "Your discipline breaks through its armor!"],
  crit:    ["DEVASTATING BLOW! The boss staggers!", "Critical strike! The demon howls!", "Your focus shatters its defenses!"],
  enraged: ["THE BOSS IS ENRAGED! Eyes burning gold!", "It will not fall without a fight!", "Darkness intensifies around the demon!"],
  low:     ["The boss is weakening... finish it!", "Victory is within reach -- push harder!", "The demon trembles before your discipline!"],
};

const CATEGORY_LABEL: Record<string, string> = {
  WAKE_UP: "Morning",
  STUDY: "Study",
  WORKOUT: "Workout",
  SAVE_MONEY: "Finance",
  FOCUS: "Focus",
  CUSTOM: "Custom",
};

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// Web Audio sound effects
function playSound(type: "hit" | "crit" | "swoosh") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "hit") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } else if (type === "crit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(); osc.stop(ctx.currentTime + 0.08);
    }
  } catch { /* audio not supported */ }
}

type BossBattlePanelProps = {
  productivityCompletion?: number;
  initialState?: ApiResponse | null;
  initialEnergy?: EnergyResponse;
};

export function BossBattlePanel({
  productivityCompletion = 0,
  initialState,
  initialEnergy,
}: BossBattlePanelProps) {
  const cachedBoss = getCachedJson<ApiResponse>("/api/boss/state") ?? initialState ?? null;
  const cachedEnergy = getCachedJson<EnergyResponse>("/api/energy") ?? initialEnergy;
  const hasInitialBoss = Boolean(cachedBoss);
  const [apiData, setApiData] = useState<ApiResponse | null>(cachedBoss);
  const [localHp, setLocalHp] = useState<number | null>(null);
  const [loading, setLoading] = useState(!cachedBoss);
  const [energy, setEnergy] = useState(cachedEnergy?.energy ?? 5);
  const [energyMax] = useState(5);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [narration, setNarration] = useState(getRandom(NARRATIONS.idle));
  const [striking, setStriking] = useState<string | null>(null);
  const [bossShake, setBossShake] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [damageNum, setDamageNum] = useState<{ val: number; id: number } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();

  const boss = apiData?.boss ?? null;
  const progress = apiData?.progress ?? null;
  const currentHp = localHp ?? progress?.currentHp ?? 0;
  const maxHp = boss?.maxHp ?? 1;
  const hpPct = maxHp > 0 ? Math.max(0, Math.min(100, (currentHp / maxHp) * 100)) : 0;
  const enraged = hpPct < 30 && hpPct > 0;
  const defeated = boss !== null && progress !== null && currentHp <= 0;

  const addLog = useCallback((msg: string, type: LogEntry["type"]) => {
    setLog(prev => [...prev.slice(-(LOG_MAX - 1)), { msg, type, ts: Date.now() }]);
  }, []);

  const loadBoss = useCallback(async (force = false) => {
    if (!hasInitialBoss && !getCachedJson<ApiResponse>("/api/boss/state")) setLoading(true);
    try {
      const data = await fetchCachedJson<ApiResponse>("/api/boss/state", { force });
      setApiData(data);
      if (data.progress?.currentHp !== undefined) setLocalHp(data.progress.currentHp);
    } catch { }
    finally { setLoading(false); }
  }, [hasInitialBoss]);

  useEffect(() => { void loadBoss(); }, [loadBoss]);

  useEffect(() => {
    const unsub = subscribeToTasksUpdate(() => {
      void loadBoss(true);
      setNarration(getRandom(NARRATIONS.hit));
    });
    return unsub;
  }, [loadBoss]);

  useEffect(() => {
    const unsub = subscribeToBossDamage((payload) => {
      void loadBoss(true);
      if (payload.damage <= 0) {
        addLog(`${payload.source} completed, but boss armor is cooling down.`, "warning");
        return;
      }

      const category = payload.category ? (CATEGORY_LABEL[payload.category] ?? payload.category) : "Quest";
      const bonus = payload.weaknessTriggered
        ? ` WEAKNESS HIT x${(payload.damageMultiplier ?? 1).toFixed(2)}`
        : "";
      addLog(`${payload.source} [${category}] dealt ${payload.damage} damage.${bonus}`, payload.weaknessTriggered ? "crit" : "damage");

      if (payload.defeated) {
        addLog(`BOSS DEFEATED! Rewards: +${payload.rewards?.exp ?? 0} EXP, +${payload.rewards?.coins ?? 0} coins.`, "crit");
      }
    });
    return unsub;
  }, [loadBoss, addLog]);

  // Fetch energy from DB
  useEffect(() => {
    const fetchEnergy = async (force = false) => {
      try {
        const data = await fetchCachedJson<EnergyResponse>("/api/energy", { force });
        setEnergy(data.energy);
      } catch { }
    };
    void fetchEnergy();
    const interval = setInterval(() => void fetchEnergy(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown tick
  useEffect(() => {
    const iv = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        let changed = false;
        for (const id in prev) {
          next[id] = Math.max(0, (prev[id] ?? 0) - 0.1);
          if (next[id] !== prev[id]) changed = true;
        }
        return changed ? next : prev;
      });
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // Idle narration cycling
  useEffect(() => {
    const iv = setInterval(() => {
      if (!striking) {
        if (hpPct < 15 && hpPct > 0) setNarration(getRandom(NARRATIONS.low));
        else if (enraged) setNarration(getRandom(NARRATIONS.enraged));
        else setNarration(getRandom(NARRATIONS.idle));
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [striking, hpPct, enraged]);

  // Scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const strike = useCallback(async (s: Strike) => {
    if (energy < 1) { addLog("No energy! Wait for regen (1 per hour).", "warning"); return; }
    if (!boss || !progress || striking || defeated) return;
    if ((cooldowns[s.id] ?? 0) > 0) return;

    setStriking(s.id);
    // The server spends the energy and resolves the hit; the UI animates from its answer.
    let data: BossAttackResponse;
    try {
      const res = await fetch("/api/boss/attack", { method: "POST" });
      const result = (await res.json().catch(() => ({}))) as BossAttackResponse & { error?: string };
      if (!res.ok) {
        addLog(result.error ?? "The strike failed.", "warning");
        setStriking(null);
        return;
      }
      data = result;
    } catch {
      addLog("Connection lost. Try again.", "warning");
      setStriking(null);
      return;
    }

    if (typeof data.energy === "number") setEnergy(data.energy);

    const dmg = data.damageApplied ?? 0;
    const isCrit = Math.random() < s.critChance; // cosmetic flavour only; damage comes from the server

    setCooldowns(prev => ({ ...prev, [s.id]: s.cooldown }));
    setLocalHp(data.progress?.currentHp ?? Math.max(0, currentHp - dmg));
    setDamageNum({ val: dmg, id: Date.now() });
    setBossShake(true); setHitFlash(true);
    setTimeout(() => { setBossShake(false); setHitFlash(false); }, 350);

    playSound(isCrit ? "crit" : "hit");

    if (isCrit) {
      addLog(`CRITICAL! ${s.name} -- ${dmg} damage!`, "crit");
      setNarration(getRandom(NARRATIONS.crit));
    } else {
      addLog(`${s.name} -- ${dmg} damage`, "damage");
      setNarration(getRandom(NARRATIONS.hit));
    }

    const newHp = Math.max(0, currentHp - dmg);
    if (newHp / maxHp < 0.3 && currentHp / maxHp >= 0.3) {
      setTimeout(() => setNarration(getRandom(NARRATIONS.enraged)), 800);
    }

    if (data.defeated) {
      addLog("BOSS DEFEATED! Rewards claimed!", "crit");
      setNarration("The demon shatters into shadow... You are victorious!");
      push({ title: "Boss defeated! Rewards claimed!", variant: "success" });
      setTimeout(() => void loadBoss(true), 3000);
    }

    setStriking(null);
  }, [boss, progress, striking, defeated, energy, cooldowns, currentHp, maxHp, addLog, loadBoss, push]);

  // Remove damage number after animation
  useEffect(() => {
    if (damageNum) { const t = setTimeout(() => setDamageNum(null), 1000); return () => clearTimeout(t); }
  }, [damageNum]);

  if (loading) return (
    <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading boss...</div>
  );

  if (!boss) return (
    <div style={{ background: "#0c1018", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.18em", marginBottom: 12, color: "#fcd34d" }}>VICTORY</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 6 }}>No Active Boss</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Complete daily habits to unlock boss encounters</div>
    </div>
  );

  const hpColor = hpPct > 50 ? "#ef4444" : hpPct > 20 ? "#f97316" : "#fbbf24";
  const weaknessLabel = boss.weakness ? (CATEGORY_LABEL[boss.weakness] ?? boss.weakness) : "Any focused habit";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* BOSS ARENA */}
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 20,
        border: `1px solid ${enraged ? "rgba(251,191,36,0.35)" : "rgba(239,68,68,0.2)"}`,
        background: "linear-gradient(160deg, #1c0810 0%, #0e0814 50%, #080b15 100%)",
        transition: "border-color 1s",
      }}>
        {/* Animated aura */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 35%, ${enraged ? "rgba(251,191,36,0.15)" : "rgba(180,0,0,0.18)"} 0%, transparent 60%)`,
          transition: "background 1s",
        }} />

        {/* Hit flash */}
        {hitFlash && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.15)", borderRadius: 20, pointerEvents: "none", zIndex: 5 }} />
        )}

        {/* Enraged badge */}
        {enraged && !defeated && (
          <div style={{ position: "absolute", top: 14, right: 14, zIndex: 10, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.5)", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 900, color: "#fbbf24" }}>
            [!] ENRAGED
          </div>
        )}

        {/* Header */}
        <div style={{ position: "relative", zIndex: 2, padding: "18px 22px 0", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Current Boss</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: enraged ? "#fbbf24" : "#f87171", lineHeight: 1 }}>{boss.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Level {boss.level ?? "?"} Boss</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, border: "1px solid rgba(251,191,36,0.28)", borderRadius: 999, background: "rgba(251,191,36,0.08)", padding: "4px 9px", color: "#fcd34d", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Weakness: {weaknessLabel}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Weekly Damage</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#a78bfa" }}>{(apiData?.progress as unknown as { weeklyDamage?: number })?.weeklyDamage?.toLocaleString() ?? "--"}</div>
          </div>
        </div>

        {/* Boss sprite area */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", height: 220 }}>
          {/* Damage number popup */}
          {damageNum && (
            <div key={damageNum.id} style={{
              position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
              fontSize: 28, fontWeight: 900, color: hitFlash ? "#fcd34d" : "#f87171",
              zIndex: 20, pointerEvents: "none",
              animation: "dmgPop 1s ease-out forwards",
            }}>
              -{damageNum.val}
            </div>
          )}

          {/* Boss SVG with float animation */}
          <div style={{
            transform: `${bossShake ? "translateX(-6px) scale(0.95)" : "translateX(0) scale(1)"} ${defeated ? "scale(0.7)" : ""}`,
            transition: "transform 0.15s",
            filter: defeated ? "grayscale(1) opacity(0.4)" : enraged ? "drop-shadow(0 0 16px rgba(251,191,36,0.5))" : "drop-shadow(0 0 8px rgba(220,38,38,0.35))",
            animation: "none",
          }}>
            <BossArt name={boss?.name} size={230} isHit={hitFlash} enraged={enraged} defeated={defeated} />
          </div>

          {/* Narration text */}
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            maxWidth: "80%", textAlign: "center",
            fontSize: 11, fontStyle: "italic", color: "rgba(255,255,255,0.45)",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}>
            {defeated ? "The demon has been vanquished..." : narration}
          </div>
        </div>

        {/* HP Bar */}
        <div style={{ position: "relative", zIndex: 2, padding: "12px 22px 18px" }}>
          <div style={{ marginBottom: 12, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: "10px 12px", color: "rgba(255,255,255,0.55)", fontSize: 11, lineHeight: 1.45 }}>
            Selesaikan quest kategori <strong style={{ color: "#fcd34d" }}>{weaknessLabel}</strong> untuk damage ekstra. Manual attack tetap bisa dipakai, tapi habit yang cocok adalah serangan utama.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Boss HP</span>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: hpColor }}>
                {currentHp.toLocaleString()} / {maxHp.toLocaleString()}
              </span>
              <span style={{ fontSize: 13, fontWeight: 900, color: hpColor }}>{Math.round(hpPct)}%</span>
            </div>
          </div>
          <div style={{ height: 14, background: "rgba(0,0,0,0.5)", borderRadius: 7, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{
              height: "100%", borderRadius: 7, width: `${hpPct}%`,
              background: enraged ? "linear-gradient(90deg, #dc2626, #fbbf24)" : "linear-gradient(90deg, #7f1d1d, #dc2626, #ef4444)",
              transition: "width 0.5s ease, background 1s",
              boxShadow: `0 0 10px ${enraged ? "rgba(251,191,36,0.4)" : "rgba(239,68,68,0.3)"}`,
            }} />
          </div>
          {defeated && (
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 16, fontWeight: 900, color: "#fcd34d" }}>
              BOSS DEFEATED! Claim your rewards!
            </div>
          )}
        </div>
      </div>

      {/* COMBAT PANEL */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* LEFT: Strikes + Energy */}
        <div style={{ background: "#0c1018", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Combat Actions</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", minWidth: 56 }}>Energy {Math.round(energy)}</span>
              <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(energy / energyMax) * 100}%`, background: "linear-gradient(90deg, #d97706, #fbbf24)", borderRadius: 3, transition: "width 0.1s" }} />
              </div>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>/{energyMax}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.34)" }}>
              Daily productivity charge: {productivityCompletion}%
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: 12 }}>
            {STRIKES.map(s => {
              const cd = cooldowns[s.id] ?? 0;
              const onCd = cd > 0;
              const noEnergy = energy <= 0;
              const disabled = onCd || noEnergy || !!striking || defeated;
              return (
                <button key={s.id} type="button" disabled={disabled}
                  onClick={() => { playSound("swoosh"); void strike(s); }}
                  style={{
                    position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 10, border: "1px solid",
                    borderColor: disabled ? "rgba(255,255,255,0.07)" : `${s.color}45`,
                    background: disabled ? "rgba(255,255,255,0.02)" : `${s.color}12`,
                    cursor: disabled ? "not-allowed" : "pointer", overflow: "hidden",
                  }}>
                  {onCd && (
                    <>
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, zIndex: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>{cd.toFixed(1)}s</span>
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: `${((s.cooldown - cd) / s.cooldown) * 100}%`, background: s.color, transition: "width 0.1s", zIndex: 3 }} />
                    </>
                  )}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: disabled && !onCd ? "rgba(255,255,255,0.3)" : "#fff" }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{s.desc} - CD {s.cooldown}s</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.baseDamage}+ dmg</span>
                    <span style={{ fontSize: 9, color: "#f59e0b" }}>Energy {s.cost}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Battle log + rewards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Battle log */}
          <div style={{ background: "#0c1018", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)" }}>Battle Log</div>
            </div>
            <div ref={logRef} style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5, overflowY: "auto", maxHeight: 200, minHeight: 120 }}>
              {log.length === 0 ? (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Awaiting first strike...</div>
              ) : log.map((e, i) => {
                const c = e.type === "crit" ? "#fcd34d" : e.type === "damage" ? "#f87171" : e.type === "warning" ? "#fb923c" : "#22d3ee";
                return (
                  <div key={i} style={{ fontSize: 11, color: c, display: "flex", gap: 6 }}>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 9, flexShrink: 0 }}>
                      {new Date(e.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span>{e.msg}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards */}
          <div style={{ background: "#0c1018", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Defeat Rewards</div>
            <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#a78bfa" }}>+{(boss.rewardExp ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>EXP</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#f59e0b" }}>+{(boss.rewardCoins ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Coins</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{Math.round(100 - hpPct)}%</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Dealt</div>
              </div>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${100 - hpPct}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 3, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bossFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes dmgPop {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.2); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(0.8); }
        }
      `}</style>
    </div>
  );
}




