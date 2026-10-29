"use client";

import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, Gift, Swords, Trophy, UserRound, Zap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

type Feature = {
  icon: typeof Swords;
  title: string;
  desc: string;
  tag: string;
  tone: "gold" | "violet" | "rose" | "teal";
};

const FEATURES: Feature[] = [
  {
    icon: Swords,
    title: "Boss yang Menantikan",
    desc: "Penundaan berubah menjadi musuh aktif. Semakin lama kamu diam, semakin tebal HP yang harus ditembus.",
    tag: "Combat",
    tone: "gold",
  },
  {
    icon: UserRound,
    title: "Identitas yang Nyata",
    desc: "Pilih class, bangun reputasi, dan lihat karaktermu berkembang sesuai ritme hidupmu sendiri.",
    tag: "Identity",
    tone: "violet",
  },
  {
    icon: Flame,
    title: "Streak Punya Jiwa",
    desc: "Streak bukan dekorasi angka. Ia jadi tekanan, perlindungan, dan bukti bahwa kamu terus hadir.",
    tag: "Retention",
    tone: "rose",
  },
  {
    icon: Gift,
    title: "Daily Chest",
    desc: "Reward harian membuat rutinitas terasa punya konsekuensi: simpan, pakai, dan upgrade progresmu.",
    tag: "Daily Loop",
    tone: "teal",
  },
  {
    icon: Zap,
    title: "Combo Multiplier",
    desc: "Aksi yang konsisten terasa makin kuat. Momentum kecil berubah menjadi damage besar.",
    tag: "Feedback",
    tone: "gold",
  },
  {
    icon: Trophy,
    title: "PvP & Guild",
    desc: "Bersaing sehat, bangun aliansi, dan jadikan progres personal terasa hidup bersama pemain lain.",
    tag: "Social",
    tone: "rose",
  },
];

export function LandingFeatures() {
  const reduce = useReducedMotion();

  // The glow under each card follows the cursor.
  function trackPointer(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <section className="landing-features">
      <Reveal>
        <div className="section-divider">
          <span />
          <p>System Online</p>
          <span />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="features-heading">
          <h2>
            Bukan productivity app <em>biasa.</em>
          </h2>
          <p>Setiap ritual harian punya bobot dalam dunia game yang hidup.</p>
        </div>
      </Reveal>

      <div className="features-grid">
        {FEATURES.map(({ icon: Icon, title, desc, tag, tone }, index) => (
          <motion.article
            key={title}
            className={`feature-card ${tone}`}
            onMouseMove={trackPointer}
            initial={reduce ? false : { opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { y: -8 }}
          >
            <div className="feature-icon">
              <Icon aria-hidden />
            </div>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
            <strong>{tag}</strong>
          </motion.article>
        ))}
      </div>

      <style>{`
        .landing-features {
          position: relative;
          z-index: 1;
          padding: 24px 0 70px;
        }

        .section-divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          margin-bottom: 26px;
        }

        .section-divider span {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.7), transparent);
        }

        .section-divider p {
          margin: 0;
          color: #a78bfa;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }

        .section-divider p::before {
          content: "";
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: 12px;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 12px #2dd4bf;
          animation: blink 1.6s ease-in-out infinite;
        }

        .features-heading { margin-bottom: 38px; text-align: center; }

        .features-heading h2 {
          margin: 0;
          color: #fff;
          font-size: 40px;
          font-weight: 900;
          line-height: 1.12;
        }

        .features-heading h2 em {
          font-style: normal;
          background: linear-gradient(100deg, #a855f7, #2dd4bf, #facc15, #a855f7);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: flow 6s linear infinite;
        }

        .features-heading p {
          margin: 12px 0 0;
          color: rgba(203, 213, 225, 0.62);
          font-size: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .feature-card {
          --accent: 168, 85, 247;
          --mx: 50%;
          --my: 0%;
          position: relative;
          display: flex;
          min-height: 238px;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
          overflow: hidden;
          border: 1px solid rgba(var(--accent), 0.3);
          border-radius: 18px;
          background: linear-gradient(150deg, rgba(15, 23, 42, 0.86), rgba(8, 10, 26, 0.9));
          padding: 26px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card.gold { --accent: 250, 204, 21; }
        .feature-card.rose { --accent: 244, 114, 182; }
        .feature-card.teal { --accent: 45, 212, 191; }

        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0;
          background: radial-gradient(260px circle at var(--mx) var(--my), rgba(var(--accent), 0.2), transparent 60%);
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .feature-card:hover {
          border-color: rgba(var(--accent), 0.85);
          box-shadow: 0 18px 50px rgba(var(--accent), 0.18);
        }

        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          position: relative;
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 1px solid rgba(var(--accent), 0.5);
          border-radius: 14px;
          background: rgba(var(--accent), 0.1);
          color: rgb(var(--accent));
          box-shadow: 0 0 22px rgba(var(--accent), 0.22);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .feature-icon svg { width: 25px; height: 25px; }
        .feature-card:hover .feature-icon { transform: rotate(-8deg) scale(1.14); }

        .feature-card h3 { margin: 0; color: #fff; font-size: 19px; font-weight: 800; }

        .feature-card p {
          margin: 8px 0 0;
          color: rgba(203, 213, 225, 0.66);
          font-size: 14px;
          line-height: 1.7;
        }

        .feature-card strong {
          align-self: flex-start;
          border: 1px solid rgba(var(--accent), 0.4);
          border-radius: 999px;
          padding: 4px 12px;
          color: rgb(var(--accent));
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        @keyframes blink { 50% { opacity: 0.25; } }
        @keyframes flow { to { background-position: -250% 0; } }

        @media (max-width: 960px) {
          .features-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .features-grid { grid-template-columns: minmax(0, 1fr); }
          .features-heading h2 { font-size: 30px; }
          .feature-card { min-height: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-features *, .landing-features *::before, .landing-features *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
