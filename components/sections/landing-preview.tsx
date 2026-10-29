"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, Play, RefreshCw, Shield, Swords } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const LOOP_STEPS = [
  {
    num: "01",
    icon: Shield,
    title: "Pilih Kelas",
    desc: "Tentukan role, value, dan build-mu. Ini awal dari karakter yang kamu rawat.",
    tone: "violet",
  },
  {
    num: "02",
    icon: Swords,
    title: "Serang Boss",
    desc: "Task selesai menjadi damage untuk prokrastinasi, mager, dan distraksi.",
    tone: "rose",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Naik Level",
    desc: "Quest harian membuka EXP, coins, item, dan dungeon baru.",
    tone: "teal",
  },
  {
    num: "04",
    icon: RefreshCw,
    title: "Berulang",
    desc: "Refleksi, upgrade kebiasaan, lalu mulai siklus berikutnya lebih kuat.",
    tone: "violet",
  },
];

export function LandingPreview() {
  const reduce = useReducedMotion();

  return (
    <section className="landing-preview">
      <Reveal>
        <div className="loop-heading">
          <div className="loop-eyebrow">
            <span />
            Core Loop
          </div>
          <h2>Empat langkah. Satu siklus.</h2>
          <p>Setiap hari adalah chapter baru dalam perjalanan pengembangan dirimu.</p>
        </div>
      </Reveal>

      <div className="steps-wrap">
        <motion.div
          className="steps-line"
          aria-hidden
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        <div className="steps-grid">
          {LOOP_STEPS.map(({ num, icon: Icon, title, desc, tone }, index) => (
            <motion.article
              key={num}
              className={`step-card ${tone}`}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { y: -8 }}
            >
              <motion.p
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.25 + index * 0.18 }}
              >
                {num}
              </motion.p>
              <div className="step-main">
                <div className="step-icon">
                  <Icon aria-hidden />
                </div>
                <div>
                  <h3>{title}</h3>
                  <span>{desc}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Reveal y={40} scale={0.97}>
        <div className="final-cta">
          <div className="cta-sigil left" />
          <div className="cta-sigil right" />
          <p>Siap Memulai?</p>
          <h2>
            Mulai sekarang. <strong>Gratis.</strong>
          </h2>
          <span>Tidak perlu kartu kredit. Pilih kelas karakter dan bangun sistem hidupmu sendiri.</span>
          <div className="cta-actions">
            <Link href="/register" className="cta-main">
              Pilih Kelasmu <em aria-hidden>{"->"}</em>
            </Link>
            <Link href="/login" className="cta-demo">
              <Play aria-hidden /> Coba Demo
            </Link>
          </div>
          <small>
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </small>
        </div>
      </Reveal>

      <style>{`
        .landing-preview {
          position: relative;
          z-index: 1;
          padding-bottom: 28px;
        }

        .loop-heading { max-width: 520px; margin-bottom: 34px; }

        .loop-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          color: #2dd4bf;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }

        .loop-eyebrow span {
          width: 20px;
          height: 1px;
          background: #2dd4bf;
          box-shadow: 0 0 14px rgba(45, 212, 191, 0.7);
        }

        .loop-heading h2 { margin: 0; color: #fff; font-size: 38px; font-weight: 900; line-height: 1.12; }
        .loop-heading p { margin: 12px 0 0; color: rgba(203, 213, 225, 0.62); font-size: 16px; line-height: 1.7; }

        .steps-wrap { position: relative; padding-top: 22px; }

        .steps-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          transform-origin: 0 50%;
          background: linear-gradient(90deg, #8b5cf6, #f472b6, #2dd4bf, #8b5cf6);
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.7);
        }

        .steps-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .step-card {
          --accent: 168, 85, 247;
          position: relative;
          border: 1px solid rgba(var(--accent), 0.34);
          border-radius: 18px;
          background: linear-gradient(150deg, rgba(15, 23, 42, 0.92), rgba(8, 10, 26, 0.94));
          padding: 22px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .step-card.rose { --accent: 244, 114, 182; }
        .step-card.teal { --accent: 45, 212, 191; }

        .step-card:hover {
          border-color: rgba(var(--accent), 0.9);
          box-shadow: 0 18px 46px rgba(var(--accent), 0.2);
        }

        .step-card > p {
          margin: 0 0 18px;
          color: transparent;
          font-family: var(--font-mono);
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          -webkit-text-stroke: 1px rgba(var(--accent), 0.8);
        }

        .step-main { display: grid; gap: 14px; }

        .step-icon {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(var(--accent), 0.5);
          border-radius: 13px;
          background: rgba(var(--accent), 0.1);
          color: rgb(var(--accent));
          box-shadow: 0 0 20px rgba(var(--accent), 0.22);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .step-icon svg { width: 22px; height: 22px; }
        .step-card:hover .step-icon { transform: rotate(10deg) scale(1.15); }

        .step-card h3 { margin: 0; color: #fff; font-size: 18px; font-weight: 800; }
        .step-card span { display: block; margin-top: 6px; color: rgba(203, 213, 225, 0.64); font-size: 13.5px; line-height: 1.65; }

        /* ---------- final CTA ---------- */
        .final-cta {
          position: relative;
          isolation: isolate;
          margin-top: 64px;
          overflow: hidden;
          border-radius: 26px;
          padding: 64px 28px 54px;
          text-align: center;
        }

        .final-cta::before {
          content: "";
          position: absolute;
          z-index: -2;
          left: 50%;
          top: 50%;
          width: 160%;
          aspect-ratio: 1;
          translate: -50% -50%;
          background: conic-gradient(from 0deg, #8b5cf6, #2dd4bf, #facc15, #f472b6, #8b5cf6);
          animation: spin 9s linear infinite;
        }

        .final-cta::after {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 2px;
          border-radius: 24px;
          background:
            radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.34), transparent 55%),
            linear-gradient(180deg, #0b0a22, #05060f);
        }

        .cta-sigil {
          position: absolute;
          top: 50%;
          width: 240px;
          height: 240px;
          border: 1px dashed rgba(167, 139, 250, 0.35);
          border-radius: 50%;
          translate: 0 -50%;
          animation: spin 28s linear infinite;
        }

        .cta-sigil::after {
          content: "";
          position: absolute;
          inset: 28px;
          border: 1px solid rgba(45, 212, 191, 0.3);
          border-radius: 50%;
          animation: spin 18s linear infinite reverse;
        }

        .cta-sigil.left { left: -110px; }
        .cta-sigil.right { right: -110px; animation-direction: reverse; }

        .final-cta > p {
          margin: 0;
          color: #facc15;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .final-cta h2 { margin: 14px 0 0; color: #fff; font-size: 44px; font-weight: 900; line-height: 1.1; }
        .final-cta h2 strong {
          background: linear-gradient(100deg, #f6c448 20%, #fff3b0 45%, #f6c448 70%);
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gold-flow 4.5s linear infinite;
        }

        .final-cta > span {
          display: block;
          max-width: 520px;
          margin: 16px auto 0;
          color: rgba(203, 213, 225, 0.7);
          font-size: 15.5px;
          line-height: 1.7;
        }

        .cta-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 30px; }

        .cta-main,
        .cta-demo {
          position: relative;
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
          border-radius: 11px;
          padding: 0 30px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .cta-main {
          border: 1px solid rgba(255, 226, 122, 0.88);
          background: linear-gradient(180deg, #ffe178, #d99b1d);
          color: #1d1302;
          animation: cta-pulse 2.6s ease-in-out infinite;
        }

        .cta-main em { display: inline-block; font-style: normal; transition: transform 0.25s ease; }
        .cta-main:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(250, 204, 21, 0.55); }
        .cta-main:hover em { transform: translateX(6px); }

        .cta-demo {
          border: 1px solid rgba(139, 92, 246, 0.8);
          background: rgba(12, 10, 28, 0.7);
          color: #d8b4fe;
        }

        .cta-demo svg { width: 15px; height: 15px; }
        .cta-demo:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(124, 58, 237, 0.45); }

        .final-cta small { display: block; margin-top: 22px; color: rgba(148, 163, 184, 0.7); font-size: 13px; }
        .final-cta small a { color: #2dd4bf; text-decoration: none; }
        .final-cta small a:hover { text-decoration: underline; }

        @keyframes spin { to { rotate: 360deg; } }
        @keyframes gold-flow { to { background-position: -220% 0; } }
        @keyframes cta-pulse { 0%, 100% { box-shadow: 0 0 22px rgba(250, 204, 21, 0.32); } 50% { box-shadow: 0 0 44px rgba(250, 204, 21, 0.6); } }

        @media (max-width: 960px) {
          .steps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .steps-line { display: none; }
        }

        @media (max-width: 640px) {
          .steps-grid { grid-template-columns: minmax(0, 1fr); }
          .loop-heading h2 { font-size: 30px; }
          .final-cta { padding: 46px 20px 40px; }
          .final-cta h2 { font-size: 30px; }
          .cta-sigil { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-preview *, .landing-preview *::before, .landing-preview *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
