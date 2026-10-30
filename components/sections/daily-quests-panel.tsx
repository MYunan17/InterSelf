"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { emitBossDamageEvent, emitTasksUpdatedEvent } from "@/lib/events";

type Task = {
  id: number;
  title: string;
  isSystem: boolean;
  durationMinutes?: number | null;
  expReward?: number;
  coinReward?: number;
};

type Props = { tasks?: Task[]; completedTaskIds?: Set<number>; streak?: number };

type CompleteResponse = {
  completion?: { expEarned: number; coinsEarned: number };
  bossBattle?: {
    damageApplied?: number;
    defeated?: boolean;
    boss?: { name?: string };
    weaknessTriggered?: boolean;
    damageMultiplier?: number;
  } | null;
};

// Quest icon mapping
const QUEST_ICONS: Record<string, { path: string; bg: string }> = {
  membaca:    { path: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 004 17V4.5A2.5 2.5 0 016.5 2H20v20H6.5", bg: "rgba(245,158,11,0.12)" },
  baca:       { path: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 004 17V4.5A2.5 2.5 0 016.5 2H20v20H6.5", bg: "rgba(245,158,11,0.12)" },
  neural:     { path: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 004 17V4.5A2.5 2.5 0 016.5 2H20v20H6.5", bg: "rgba(139,92,246,0.12)" },
  ekspansi:   { path: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 004 17V4.5A2.5 2.5 0 016.5 2H20v20H6.5", bg: "rgba(139,92,246,0.12)" },
  malam:      { path: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z", bg: "rgba(99,102,241,0.12)" },
  sistem:     { path: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z", bg: "rgba(99,102,241,0.12)" },
  kekayaan:   { path: "M12 1v22 M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6", bg: "rgba(245,158,11,0.12)" },
  sinkron:    { path: "M12 1v22 M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6", bg: "rgba(245,158,11,0.12)" },
  latihan:    { path: "M6.5 6.5h11 M17.5 6.5v11a1 1 0 01-1 1h-9a1 1 0 01-1-1v-11 M10 6.5V5a1 1 0 011-1h2a1 1 0 011 1v1.5", bg: "rgba(239,68,68,0.12)" },
  workout:    { path: "M6.5 6.5h11 M17.5 6.5v11a1 1 0 01-1 1h-9a1 1 0 01-1-1v-11 M10 6.5V5a1 1 0 011-1h2a1 1 0 011 1v1.5", bg: "rgba(239,68,68,0.12)" },
  mikro:      { path: "M6.5 6.5h11 M17.5 6.5v11a1 1 0 01-1 1h-9a1 1 0 01-1-1v-11 M10 6.5V5a1 1 0 011-1h2a1 1 0 011 1v1.5", bg: "rgba(239,68,68,0.12)" },
  bangkit:    { path: "M12 3v1 M12 20v1 M4.22 4.22l.707.707 M18.36 18.36l.707.707 M1 12h2 M21 12h-2 M4.22 19.78l.707-.707 M18.36 5.64l.707-.707", bg: "rgba(245,158,11,0.12)" },
  pagi:       { path: "M12 3v1 M12 20v1 M4.22 4.22l.707.707 M18.36 18.36l.707.707 M1 12h2 M21 12h-2 M4.22 19.78l.707-.707 M18.36 5.64l.707-.707", bg: "rgba(245,158,11,0.12)" },
  sprint:     { path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", bg: "rgba(99,102,241,0.12)" },
  kerja:      { path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", bg: "rgba(99,102,241,0.12)" },
};

function getQuestIcon(title: string): { path: string; bg: string } {
  const lower = title.toLowerCase();
  for (const [key, val] of Object.entries(QUEST_ICONS)) {
    if (lower.includes(key)) return val;
  }
  return { path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", bg: "rgba(139,92,246,0.12)" };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

type TimerState = {
  taskId: number;
  totalSeconds: number;
  remainingSeconds: number;
  running: boolean;
  completed: boolean;
};

type Burst = { id: number; taskId: number; exp: number; coins: number };

export function DailyQuestsPanel({ tasks = [], completedTaskIds = new Set(), streak = 0 }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [done, setDone] = useState<Set<number>>(completedTaskIds);
  const [timers, setTimers] = useState<Record<number, TimerState>>({});
  const [busy, setBusy] = useState<Set<number>>(new Set());
  const [bursts, setBursts] = useState<Burst[]>([]);
  const { push } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const burstId = useRef(0);

  useEffect(() => { setDone(completedTaskIds); }, [completedTaskIds]);

  // Global timer tick
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev };
        let changed = false;
        for (const id in next) {
          const t = next[id]!;
          if (t.running && t.remainingSeconds > 0) {
            next[id] = { ...t, remainingSeconds: t.remainingSeconds - 1 };
            changed = true;
          } else if (t.running && t.remainingSeconds === 0) {
            next[id] = { ...t, running: false, completed: true };
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startTimer = useCallback((taskId: number, durationMinutes: number) => {
    const totalSeconds = durationMinutes * 60;
    setTimers(prev => ({
      ...prev,
      [taskId]: { taskId, totalSeconds, remainingSeconds: totalSeconds, running: true, completed: false },
    }));
  }, []);

  const pauseTimer = useCallback((taskId: number) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId]!, running: !prev[taskId]!.running },
    }));
  }, []);

  const completeTask = useCallback(async (task: Task) => {
    const taskId = task.id;
    if (done.has(taskId) || busy.has(taskId)) return;

    // Optimistic: mark done immediately, roll back if the server refuses.
    setBusy(p => new Set(p).add(taskId));
    setDone(p => new Set(p).add(taskId));
    setTimers(prev => { const n = { ...prev }; delete n[taskId]; return n; });

    const release = () => setBusy(p => { const n = new Set(p); n.delete(taskId); return n; });
    const rollback = () => setDone(p => { const n = new Set(p); n.delete(taskId); return n; });

    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
      if (!res.ok) {
        // 409 = already completed earlier today, which is not an error.
        if (res.status !== 409) {
          rollback();
          push({ title: "Gagal menyelesaikan quest", variant: "error" });
        }
        return;
      }

      const data = (await res.json().catch(() => ({}))) as CompleteResponse;
      const exp = data.completion?.expEarned ?? task.expReward ?? 0;
      const coins = data.completion?.coinsEarned ?? task.coinReward ?? 0;

      burstId.current += 1;
      const id = burstId.current;
      setBursts(p => [...p, { id, taskId, exp, coins }]);
      setTimeout(() => setBursts(p => p.filter(b => b.id !== id)), 1600);

      emitTasksUpdatedEvent();
      router.refresh(); // re-render server data: character card, sidebar EXP, weekly stats
      const hit = data.bossBattle;
      if (hit && (hit.damageApplied ?? 0) > 0) {
        emitBossDamageEvent({
          damage: hit.damageApplied ?? 0,
          source: task.title,
          bossName: hit.boss?.name,
          weaknessTriggered: hit.weaknessTriggered,
          damageMultiplier: hit.damageMultiplier,
          defeated: hit.defeated,
        });
      }
      push({ title: `Quest selesai! +${exp} XP${coins ? ` +${coins} coins` : ""}`, variant: "success" });
    } catch {
      rollback();
      push({ title: "Gagal menyelesaikan quest", variant: "error" });
    } finally {
      release();
    }
  }, [busy, done, push, router]);

  const displayTasks = tasks.slice(0, 5);
  const completedCount = displayTasks.filter(t => done.has(t.id)).length;
  const total = displayTasks.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const perfectDay = total > 0 && completedCount === total;

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 16, border: `1px solid ${perfectDay ? "rgba(58,170,122,0.5)" : "rgba(255,255,255,0.07)"}`, background: "#0c1018", transition: "border-color 0.5s ease, box-shadow 0.5s ease", boxShadow: perfectDay ? "0 0 36px rgba(58,170,122,0.18)" : "none" }}>

      {/* TODAY'S QUEST badge */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#111", fontFamily: "monospace", fontSize: 9, fontWeight: 900, padding: "4px 14px", borderRadius: "0 0 10px 10px", letterSpacing: "0.1em", whiteSpace: "nowrap", zIndex: 10 }}>
        TODAY&apos;S QUEST
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 16px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 900, color: "#fff" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f87171" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>Daily Quests</span>
        </div>
      </div>

      {/* Streak banner: real data only */}
      <div style={{ margin: "0 12px 10px", background: streak > 0 ? "rgba(248,113,113,0.06)" : "rgba(34,211,238,0.05)", border: `1px solid ${streak > 0 ? "rgba(248,113,113,0.2)" : "rgba(34,211,238,0.15)"}`, borderRadius: 8, padding: "5px 10px", display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 9, color: streak > 0 ? "#fca5a5" : "#22d3ee" }}>
          {perfectDay ? "Perfect day! Semua quest selesai" : streak > 0 ? "Selesaikan 1 quest untuk menjaga streak" : "Selesaikan 1 quest untuk memulai streak"}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: streak > 0 ? "#f87171" : "#22d3ee", whiteSpace: "nowrap" }}>
          {streak > 0 ? `🔥 ${streak} hari` : "Streak 0"}
        </span>
      </div>

      {/* Quest list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 10px 10px" }}>
        {displayTasks.length === 0 && (
          <div style={{ padding: "22px 12px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Belum ada quest. Buat quest pertamamu di menu Quests.
          </div>
        )}

        {displayTasks.map((task, idx) => {
          const isDone = done.has(task.id);
          const icon = getQuestIcon(task.title);
          const hasDuration = task.durationMinutes && task.durationMinutes > 0;
          const timer = timers[task.id];
          const timerRunning = timer?.running;
          const timerCompleted = timer?.completed;
          const timerPct = timer ? ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100 : 0;
          const burst = bursts.find(b => b.taskId === task.id);

          return (
            <motion.div
              key={task.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: isDone ? 0.7 : 1, x: 0 }}
              transition={{ duration: 0.4, delay: reduce ? 0 : 0.08 * idx, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce || isDone ? undefined : { x: 3 }}
              style={{ position: "relative", display: "flex", flexDirection: "column", background: isDone ? "rgba(58,170,122,0.06)" : "#111520", border: `1px solid ${isDone ? "rgba(58,170,122,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, overflow: "visible" }}
            >
              <AnimatePresence>
                {burst && (
                  <motion.div
                    key={burst.id}
                    initial={{ opacity: 0, y: 6, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1.1 }}
                    transition={{ duration: 1.5, times: [0, 0.15, 0.7, 1] }}
                    style={{ position: "absolute", right: 14, top: -4, zIndex: 20, pointerEvents: "none", fontFamily: "monospace", fontSize: 13, fontWeight: 900, color: "#fde047", textShadow: "0 0 14px rgba(250,204,21,0.8)", whiteSpace: "nowrap" }}
                  >
                    +{burst.exp} XP{burst.coins ? ` · +${burst.coins}` : ""}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px" }}>
                {/* Icon */}
                <div style={{ width: 34, height: 34, flexShrink: 0, background: icon.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon.path}/>
                  </svg>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "rgba(255,255,255,0.35)" }}>{task.title}</div>
                  {hasDuration && !isDone && (
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                      {timerCompleted ? "Siap diselesaikan!" : timer ? `${formatTime(timer.remainingSeconds)} tersisa` : `${task.durationMinutes} menit`}
                    </div>
                  )}
                </div>

                {/* Rewards (the real values of this task) */}
                {task.expReward !== undefined && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: "#a78bfa" }}>+{task.expReward} XP</span>
                    {!!task.coinReward && <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: "#f59e0b" }}>+{task.coinReward}</span>}
                  </div>
                )}

                {/* Action */}
                {isDone ? (
                  <motion.div
                    initial={reduce ? false : { scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 16 }}
                    style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: "rgba(58,170,122,0.28)", border: "1px solid rgba(58,170,122,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </motion.div>
                ) : hasDuration && !timerCompleted ? (
                  <motion.button type="button"
                    whileTap={reduce ? undefined : { scale: 0.92 }}
                    onClick={() => timer ? pauseTimer(task.id) : startTimer(task.id, task.durationMinutes!)}
                    style={{ flexShrink: 0, background: timerRunning ? "rgba(239,68,68,0.2)" : "rgba(34,211,238,0.15)", border: `1px solid ${timerRunning ? "rgba(239,68,68,0.4)" : "rgba(34,211,238,0.3)"}`, borderRadius: 8, padding: "5px 10px", fontSize: 9, fontWeight: 700, color: timerRunning ? "#f87171" : "#22d3ee", cursor: "pointer", whiteSpace: "nowrap" }}>
                    {timerRunning ? "Pause" : timer ? "Lanjut" : "Mulai"}
                  </motion.button>
                ) : (
                  <motion.button type="button" disabled={busy.has(task.id)}
                    whileHover={reduce ? undefined : { scale: 1.06 }}
                    whileTap={reduce ? undefined : { scale: 0.9 }}
                    onClick={() => completeTask(task)}
                    style={{ flexShrink: 0, background: "rgba(58,170,122,0.2)", border: "1px solid rgba(58,170,122,0.4)", borderRadius: 8, padding: "5px 10px", fontSize: 9, fontWeight: 700, color: "#3aaa7a", cursor: "pointer", whiteSpace: "nowrap" }}>
                    Selesaikan
                  </motion.button>
                )}
              </div>

              {/* Timer progress bar */}
              {hasDuration && timer && !isDone && (
                <div style={{ height: 3, background: "rgba(255,255,255,0.05)", width: "100%", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${timerPct}%`,
                    background: timerCompleted ? "#3aaa7a" : timerRunning ? "#22d3ee" : "#f59e0b",
                    transition: "width 1s linear, background 0.3s",
                  }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress */}
      <div style={{ padding: "0 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
          <span>Daily Progress</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {completedCount} / {total}
            <motion.svg
              key={perfectDay ? "perfect" : "open"}
              animate={perfectDay && !reduce ? { rotate: [0, -14, 14, -8, 0], scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.7 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={perfectDay ? "#facc15" : "#f59e0b"} strokeWidth="2"><path d="M8 21h8 M12 17v4 M7 4H4.5a2.5 2.5 0 000 5H7 M17 4h2.5a2.5 2.5 0 010 5H17 M7 4h10v8a5 5 0 01-10 0V4z"/></motion.svg>
          </span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: perfectDay ? "linear-gradient(90deg,#facc15,#3aaa7a)" : "linear-gradient(90deg,#10b981,#3aaa7a)", borderRadius: 3 }}
          />
        </div>
      </div>
    </div>
  );
}
