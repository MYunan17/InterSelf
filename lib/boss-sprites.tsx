import type { CSSProperties, ReactNode } from "react";

// One distinct creature per boss in the seed data. Every design is drawn in a 160x160 box, lit
// from the top-left, and exposes a few animated parts through the .boss-* classes in globals.css.

export type BossSpriteProps = {
  style?: CSSProperties;
  className?: string;
  isHit?: boolean;
};

// ---------------------------------------------------------------------------------------------
// 1. Prokrastinasi Abyssal: horned shadow demon
// ---------------------------------------------------------------------------------------------
function AbyssalDemon() {
  return (
    <>
      <defs>
        <linearGradient id="ab-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a1220" />
          <stop offset="0.5" stopColor="#240912" />
          <stop offset="1" stopColor="#0b0308" />
        </linearGradient>
        <linearGradient id="ab-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f1d1d" />
          <stop offset="1" stopColor="#1a0508" />
        </linearGradient>
        <radialGradient id="ab-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff1f2" />
          <stop offset="0.35" stopColor="#fb7185" />
          <stop offset="1" stopColor="#be123c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* wings */}
      <g className="boss-breathe">
        <path d="M58 76 Q16 56 6 18 Q34 30 44 52 Q36 40 48 30 Q52 52 62 62Z" fill="url(#ab-wing)" />
        <path d="M102 76 Q144 56 154 18 Q126 30 116 52 Q124 40 112 30 Q108 52 98 62Z" fill="url(#ab-wing)" />
        <path d="M10 22 Q34 44 56 70 M24 28 Q40 48 58 68 M44 32 Q50 50 60 66" fill="none" stroke="#f43f5e" strokeWidth="0.9" opacity=".45" />
        <path d="M150 22 Q126 44 104 70 M136 28 Q120 48 102 68 M116 32 Q110 50 100 66" fill="none" stroke="#f43f5e" strokeWidth="0.9" opacity=".45" />
      </g>
      {/* smoky base */}
      <path d="M34 150 Q24 130 40 118 Q60 110 80 112 Q100 110 120 118 Q136 130 126 150 Q80 158 34 150Z" fill="url(#ab-body)" />
      <path d="M44 148 Q40 138 50 134 M70 152 Q66 140 76 136 M96 152 Q100 140 92 134 M116 148 Q122 138 110 134" fill="none" stroke="#3b0d19" strokeWidth="6" strokeLinecap="round" opacity=".8" />
      {/* torso */}
      <path d="M46 78 Q40 110 52 134 Q80 142 108 134 Q120 110 114 78 Q98 68 80 68 Q62 68 46 78Z" fill="url(#ab-body)" />
      <path d="M52 84 Q48 108 58 128" fill="none" stroke="#fb7185" strokeWidth="1" opacity=".35" />
      <circle cx="80" cy="102" r="16" fill="url(#ab-core)" className="boss-core" />
      <path d="M68 96 L80 90 L92 96 L92 108 L80 116 L68 108Z" fill="none" stroke="#fda4af" strokeWidth="1.2" opacity=".6" />
      {/* arms and claws */}
      <path d="M48 82 Q28 90 22 112 Q30 114 36 108 Q38 120 46 120 Q46 104 54 94Z" fill="url(#ab-body)" />
      <path d="M112 82 Q132 90 138 112 Q130 114 124 108 Q122 120 114 120 Q114 104 106 94Z" fill="url(#ab-body)" />
      <path d="M22 112 L14 124 M30 116 L26 130 M38 116 L38 130" stroke="#fb7185" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M138 112 L146 124 M130 116 L134 130 M122 116 L122 130" stroke="#fb7185" strokeWidth="2.4" strokeLinecap="round" />
      {/* head */}
      <path d="M52 52 Q50 24 80 20 Q110 24 108 52 Q106 72 80 78 Q54 72 52 52Z" fill="url(#ab-body)" />
      <path d="M54 50 Q54 28 80 24" fill="none" stroke="#fb7185" strokeWidth="1" opacity=".45" />
      {/* horns */}
      <path d="M56 32 Q40 24 38 4 Q54 8 62 24Z" fill="#2a0a14" />
      <path d="M104 32 Q120 24 122 4 Q106 8 98 24Z" fill="#2a0a14" />
      <path d="M57 30 Q44 22 41 8" fill="none" stroke="#fb7185" strokeWidth="1" opacity=".5" />
      <path d="M103 30 Q116 22 119 8" fill="none" stroke="#fb7185" strokeWidth="1" opacity=".5" />
      {/* eyes */}
      <g className="boss-eye">
        <path d="M58 46 Q68 40 76 48 Q68 54 58 46Z" fill="#fb7185" />
        <path d="M102 46 Q92 40 84 48 Q92 54 102 46Z" fill="#fb7185" />
        <path d="M64 46 L70 46" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M96 46 L90 46" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="67" cy="47" rx="13" ry="8" fill="#fb7185" opacity=".22" />
        <ellipse cx="93" cy="47" rx="13" ry="8" fill="#fb7185" opacity=".22" />
      </g>
      {/* maw */}
      <path d="M62 62 Q80 76 98 62 Q92 72 80 74 Q68 72 62 62Z" fill="#12030a" />
      <path d="M66 63 L68 69 L71 64 M76 66 L78 73 L81 67 M89 66 L91 70 L94 64" stroke="#ffe4e6" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// 2. Echo Titan: lava-cracked stone golem
// ---------------------------------------------------------------------------------------------
function EchoTitan() {
  return (
    <>
      <defs>
        <linearGradient id="et-rock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5a48" />
          <stop offset="0.5" stopColor="#4a3328" />
          <stop offset="1" stopColor="#201510" />
        </linearGradient>
        <linearGradient id="et-lava" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#fb923c" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {/* floating rocks */}
      <g className="boss-rock">
        <path d="M14 56 L26 50 L32 62 L20 70Z" fill="url(#et-rock)" />
        <path d="M132 40 L146 46 L142 60 L128 54Z" fill="url(#et-rock)" />
      </g>
      <g className="boss-rock boss-rock-2">
        <path d="M24 100 L34 96 L38 106 L28 110Z" fill="url(#et-rock)" />
        <path d="M126 96 L138 100 L134 112 L124 106Z" fill="url(#et-rock)" />
      </g>
      {/* legs */}
      <path d="M48 118 L76 118 L74 150 L42 150Z" fill="url(#et-rock)" />
      <path d="M84 118 L112 118 L118 150 L86 150Z" fill="url(#et-rock)" />
      <path d="M42 142 L74 142 L74 152 L38 152Z" fill="#2a1c14" />
      <path d="M86 142 L118 142 L122 152 L86 152Z" fill="#2a1c14" />
      {/* torso */}
      <g className="boss-breathe">
        <path d="M38 70 L122 70 L112 124 L48 124Z" fill="url(#et-rock)" />
        <path d="M38 70 L122 70 L118 82 L42 82Z" fill="#9a735c" opacity=".55" />
        <path d="M80 72 L74 90 L84 100 L76 118" fill="none" stroke="url(#et-lava)" strokeWidth="3.4" strokeLinecap="round" className="boss-core" />
        <path d="M58 84 L68 96 L60 112 M104 84 L94 98 L102 114" fill="none" stroke="url(#et-lava)" strokeWidth="2.4" strokeLinecap="round" className="boss-core" />
        <circle cx="80" cy="96" r="9" fill="#fb923c" opacity=".35" className="boss-core" />
      </g>
      {/* shoulders and arms */}
      <path d="M18 76 Q16 60 40 62 L46 84 Q30 92 18 76Z" fill="url(#et-rock)" />
      <path d="M142 76 Q144 60 120 62 L114 84 Q130 92 142 76Z" fill="url(#et-rock)" />
      <path d="M22 82 L34 86 L30 124 L14 122Z" fill="url(#et-rock)" />
      <path d="M138 82 L126 86 L130 124 L146 122Z" fill="url(#et-rock)" />
      <path d="M10 120 L34 120 L34 142 L14 144Z" fill="#6a4a3a" />
      <path d="M126 120 L150 120 L148 144 L126 142Z" fill="#6a4a3a" />
      <path d="M16 124 L30 124 M130 124 L144 124" stroke="#fb923c" strokeWidth="1.6" className="boss-core" />
      {/* head */}
      <path d="M58 30 L102 30 L106 66 L54 66Z" fill="url(#et-rock)" />
      <path d="M58 30 L102 30 L100 38 L60 38Z" fill="#a07a62" opacity=".55" />
      <path d="M66 22 L72 10 L78 24 M82 24 L90 8 L96 26" fill="#3a271d" stroke="#3a271d" strokeWidth="3" strokeLinejoin="round" />
      <g className="boss-eye">
        <rect x="64" y="42" width="12" height="8" rx="1.6" fill="#fde68a" />
        <rect x="84" y="42" width="12" height="8" rx="1.6" fill="#fde68a" />
        <rect x="60" y="38" width="20" height="16" fill="#fb923c" opacity=".26" />
        <rect x="80" y="38" width="20" height="16" fill="#fb923c" opacity=".26" />
      </g>
      <path d="M66 58 L94 58" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" className="boss-core" />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// 3. Gravemind Regent: frost lich king
// ---------------------------------------------------------------------------------------------
function GravemindRegent() {
  return (
    <>
      <defs>
        <linearGradient id="gr-cape" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d4ed8" />
          <stop offset="0.6" stopColor="#172554" />
          <stop offset="1" stopColor="#0a0f24" />
        </linearGradient>
        <linearGradient id="gr-ice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0f9ff" />
          <stop offset="0.5" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="gr-bone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      {/* cape */}
      <g className="boss-sway">
        <path d="M44 66 Q22 110 26 152 L42 144 L54 156 L66 144 L80 156 L94 144 L106 156 L118 144 L134 152 Q138 110 116 66Z" fill="url(#gr-cape)" />
        <path d="M26 152 L42 144 L54 156 L66 144 L80 156 L94 144 L106 156 L118 144 L134 152" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity=".6" />
      </g>
      {/* ribcage */}
      <path d="M62 76 Q80 70 98 76 L96 118 Q80 124 64 118Z" fill="#0b1226" />
      <path d="M66 82 Q80 86 94 82 M66 92 Q80 96 94 92 M67 102 Q80 106 93 102 M68 112 Q80 115 92 112" fill="none" stroke="url(#gr-bone)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M80 78 L80 118" stroke="url(#gr-bone)" strokeWidth="2.4" />
      <circle cx="80" cy="98" r="6" fill="#7dd3fc" opacity=".7" className="boss-core" />
      {/* pauldrons with ice spikes */}
      <path d="M34 80 Q32 64 52 64 L60 84 Q44 90 34 80Z" fill="url(#gr-ice)" />
      <path d="M126 80 Q128 64 108 64 L100 84 Q116 90 126 80Z" fill="url(#gr-ice)" />
      <path d="M36 70 L28 52 L44 64 M44 64 L40 44 L54 62 M124 70 L132 52 L116 64 M116 64 L120 44 L106 62" fill="url(#gr-ice)" stroke="#e0f2fe" strokeWidth="0.8" strokeLinejoin="round" />
      {/* arms */}
      <path d="M40 84 Q26 100 30 122" fill="none" stroke="url(#gr-bone)" strokeWidth="4" strokeLinecap="round" />
      <path d="M120 84 Q134 100 130 120" fill="none" stroke="url(#gr-bone)" strokeWidth="4" strokeLinecap="round" />
      <g className="boss-rock">
        <path d="M30 118 L38 126 L30 144 L22 126Z" fill="url(#gr-ice)" />
        <circle cx="30" cy="130" r="14" fill="#7dd3fc" opacity=".22" className="boss-core" />
      </g>
      <path d="M130 118 L136 124 M130 118 L124 124 M130 118 L130 112" stroke="url(#gr-bone)" strokeWidth="2.4" strokeLinecap="round" />
      {/* skull */}
      <path d="M56 40 Q54 18 80 16 Q106 18 104 40 Q104 54 96 58 L94 68 L66 68 L64 58 Q56 54 56 40Z" fill="url(#gr-bone)" />
      <path d="M60 28 Q80 18 100 28" fill="none" stroke="#fff" strokeWidth="1.4" opacity=".6" />
      <g className="boss-eye">
        <path d="M62 38 Q70 32 76 40 Q70 48 62 44Z" fill="#06b6d4" />
        <path d="M98 38 Q90 32 84 40 Q90 48 98 44Z" fill="#06b6d4" />
        <ellipse cx="69" cy="40" rx="11" ry="8" fill="#22d3ee" opacity=".3" />
        <ellipse cx="91" cy="40" rx="11" ry="8" fill="#22d3ee" opacity=".3" />
      </g>
      <path d="M78 50 L80 56 L82 50Z" fill="#475569" />
      <path d="M68 62 L68 68 M74 62 L74 68 M80 62 L80 68 M86 62 L86 68 M92 62 L92 68" stroke="#475569" strokeWidth="1.2" />
      {/* ice crown */}
      <path d="M54 26 L52 4 L64 18 L72 0 L80 16 L88 0 L96 18 L108 4 L106 26Z" fill="url(#gr-ice)" stroke="#e0f2fe" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M72 0 L72 14 M88 0 L88 14" stroke="#fff" strokeWidth="0.8" opacity=".6" />
      <circle cx="80" cy="22" r="3.2" fill="#fff" className="boss-core" />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// 4. Wrath of Stagnation: arcane watcher eye
// ---------------------------------------------------------------------------------------------
function WrathOfStagnation() {
  return (
    <>
      <defs>
        <radialGradient id="ws-eye" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#faf5ff" />
          <stop offset="0.6" stopColor="#d8b4fe" />
          <stop offset="1" stopColor="#7e22ce" />
        </radialGradient>
        <radialGradient id="ws-iris" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="0.5" stopColor="#c026d3" />
          <stop offset="1" stopColor="#4a044e" />
        </radialGradient>
        <linearGradient id="ws-tent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b21a8" />
          <stop offset="1" stopColor="#1e0a3c" />
        </linearGradient>
      </defs>
      {/* rune ring */}
      <g className="boss-rot">
        <circle cx="80" cy="66" r="58" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 6" opacity=".7" />
        <circle cx="80" cy="66" r="50" fill="none" stroke="#e879f9" strokeWidth="0.8" opacity=".35" />
        <path d="M80 4 l3 5 l-3 5 l-3 -5z M138 66 l-5 3 l-5 -3 l5 -3z M80 128 l3 -5 l-3 -5 l-3 5z M22 66 l5 3 l5 -3 l-5 -3z" fill="#f0abfc" />
      </g>
      {/* tentacles */}
      <g className="boss-sway">
        <path d="M60 104 Q42 120 50 140 Q54 150 46 156 Q60 156 62 140 Q62 124 70 110Z" fill="url(#ws-tent)" />
        <path d="M100 104 Q118 120 110 140 Q106 150 114 156 Q100 156 98 140 Q98 124 90 110Z" fill="url(#ws-tent)" />
        <path d="M74 110 Q66 132 74 150 Q82 156 80 142 Q80 126 82 110Z" fill="url(#ws-tent)" />
        <path d="M86 110 Q94 132 86 150 Q78 156 80 142Z" fill="#3b0764" />
      </g>
      {/* eye body */}
      <g className="boss-breathe">
        <path d="M18 66 Q48 22 80 22 Q112 22 142 66 Q112 110 80 110 Q48 110 18 66Z" fill="url(#ws-eye)" />
        <path d="M18 66 Q48 22 80 22 Q112 22 142 66" fill="none" stroke="#f5d0fe" strokeWidth="1.6" opacity=".8" />
        <path d="M30 56 Q38 44 48 40 M112 40 Q122 44 130 56" fill="none" stroke="#a21caf" strokeWidth="1" opacity=".5" />
        <path d="M26 72 Q40 90 56 98 M134 72 Q120 90 104 98" fill="none" stroke="#c026d3" strokeWidth="0.9" opacity=".45" />
        <g className="boss-eye">
          <circle cx="80" cy="66" r="26" fill="url(#ws-iris)" />
          <circle cx="80" cy="66" r="26" fill="none" stroke="#fde047" strokeWidth="1.2" opacity=".6" />
          <ellipse cx="80" cy="66" rx="5.6" ry="20" fill="#0a0212" />
          <ellipse cx="70" cy="56" rx="4.4" ry="3" fill="#fff" opacity=".85" />
        </g>
        {/* lids */}
        <path d="M14 66 Q46 14 80 14 Q114 14 146 66 Q114 36 80 36 Q46 36 14 66Z" fill="#3b0764" />
        <path d="M14 66 Q46 14 80 14" fill="none" stroke="#e879f9" strokeWidth="1" opacity=".6" />
        <path d="M30 40 L24 28 M46 30 L42 16 M114 30 L118 16 M130 40 L136 28" stroke="#6b21a8" strokeWidth="3" strokeLinecap="round" />
      </g>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// 5. The Hollow Crown: empty golden armor under a floating crown
// ---------------------------------------------------------------------------------------------
function HollowCrown() {
  return (
    <>
      <defs>
        <linearGradient id="hc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef9c3" />
          <stop offset="0.45" stopColor="#facc15" />
          <stop offset="1" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="hc-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b2f10" />
          <stop offset="1" stopColor="#0f0b04" />
        </linearGradient>
        <radialGradient id="hc-void" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#1a0b2e" />
          <stop offset="1" stopColor="#020105" />
        </radialGradient>
      </defs>
      {/* tattered robe base */}
      <path d="M44 120 L116 120 L124 154 L106 146 L94 156 L80 146 L66 156 L54 146 L36 154Z" fill="url(#hc-dark)" />
      <path d="M44 120 L36 154 M116 120 L124 154" stroke="#facc15" strokeWidth="1" opacity=".5" />
      {/* chestplate */}
      <g className="boss-breathe">
        <path d="M46 72 L114 72 L106 124 Q80 132 54 124Z" fill="url(#hc-gold)" />
        <path d="M80 72 L80 128" stroke="#92400e" strokeWidth="1.4" opacity=".6" />
        <path d="M54 92 Q80 100 106 92 M56 106 Q80 114 104 106" fill="none" stroke="#a16207" strokeWidth="1.4" />
        <path d="M80 82 L89 96 L80 112 L71 96Z" fill="url(#hc-void)" stroke="#fde047" strokeWidth="1.2" />
        <circle cx="80" cy="96" r="3" fill="#c084fc" className="boss-core" />
      </g>
      {/* pauldrons */}
      <path d="M22 84 Q20 62 46 64 L52 88 Q34 98 22 84Z" fill="url(#hc-gold)" />
      <path d="M138 84 Q140 62 114 64 L108 88 Q126 98 138 84Z" fill="url(#hc-gold)" />
      <path d="M24 76 Q30 66 44 66" fill="none" stroke="#fff" strokeWidth="1" opacity=".6" />
      <path d="M28 88 Q38 94 50 88 M132 88 Q122 94 110 88" fill="none" stroke="#7c2d12" strokeWidth="1.4" />
      {/* floating gauntlets */}
      <g className="boss-rock">
        <path d="M10 98 L30 98 L32 120 L14 124Z" fill="url(#hc-gold)" />
        <path d="M12 106 L30 106 M12 114 L31 114" stroke="#a16207" strokeWidth="1.2" />
        <circle cx="22" cy="110" r="14" fill="#fde047" opacity=".16" className="boss-core" />
      </g>
      <g className="boss-rock boss-rock-2">
        <path d="M130 98 L150 98 L146 124 L128 120Z" fill="url(#hc-gold)" />
        <path d="M130 106 L148 106 M129 114 L148 114" stroke="#a16207" strokeWidth="1.2" />
        <circle cx="138" cy="110" r="14" fill="#fde047" opacity=".16" className="boss-core" />
      </g>
      {/* helm: hollow inside */}
      <path d="M54 62 Q52 28 80 24 Q108 28 106 62 L100 70 L60 70Z" fill="url(#hc-gold)" />
      <path d="M62 54 Q64 38 80 36 Q96 38 98 54 L94 66 L66 66Z" fill="url(#hc-void)" />
      <path d="M60 34 Q80 26 100 34" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".6" />
      <g className="boss-eye">
        <ellipse cx="71" cy="52" rx="4.4" ry="3" fill="#fde047" />
        <ellipse cx="89" cy="52" rx="4.4" ry="3" fill="#fde047" />
        <ellipse cx="71" cy="52" rx="10" ry="6" fill="#facc15" opacity=".28" />
        <ellipse cx="89" cy="52" rx="10" ry="6" fill="#facc15" opacity=".28" />
      </g>
      <path d="M72 62 L88 62" stroke="#a855f7" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      {/* floating crown */}
      <g className="boss-rock boss-rock-2">
        <path d="M46 20 L40 -2 L58 10 L66 -6 L80 8 L94 -6 L102 10 L120 -2 L114 20Z" transform="translate(0 4)" fill="url(#hc-gold)" stroke="#fef08a" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M46 24 L114 24" stroke="#a16207" strokeWidth="3" />
        <circle cx="66" cy="0" r="2.6" fill="#f43f5e" />
        <circle cx="80" cy="12" r="3.2" fill="#38bdf8" className="boss-core" />
        <circle cx="94" cy="0" r="2.6" fill="#f43f5e" />
      </g>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// 6. Chronovore: clock-faced time devourer
// ---------------------------------------------------------------------------------------------
function Chronovore() {
  const ticks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <>
      <defs>
        <linearGradient id="cv-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5eead4" />
          <stop offset="0.5" stopColor="#0f766e" />
          <stop offset="1" stopColor="#042f2e" />
        </linearGradient>
        <radialGradient id="cv-face" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#f0fdfa" />
          <stop offset="1" stopColor="#5eead4" />
        </radialGradient>
      </defs>
      {/* tail spiral */}
      <path d="M118 128 Q150 126 150 100 Q150 80 130 82 Q116 84 118 98 Q120 108 130 106" fill="none" stroke="url(#cv-body)" strokeWidth="12" strokeLinecap="round" />
      <path d="M130 106 L136 100 L134 110Z" fill="#99f6e4" />
      {/* devouring ring */}
      <g className="boss-breathe">
        <circle cx="76" cy="82" r="56" fill="none" stroke="url(#cv-body)" strokeWidth="16" />
        <circle cx="76" cy="82" r="63" fill="none" stroke="#5eead4" strokeWidth="1" opacity=".5" />
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x1 = 76 + Math.cos(angle) * 49;
          const y1 = 82 + Math.sin(angle) * 49;
          const x2 = 76 + Math.cos(angle + 0.06) * 38;
          const y2 = 82 + Math.sin(angle + 0.06) * 38;
          const x3 = 76 + Math.cos(angle + 0.14) * 49;
          const y3 = 82 + Math.sin(angle + 0.14) * 49;
          return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)}Z`} fill="#f0fdfa" opacity=".92" />;
        })}
      </g>
      {/* clock face */}
      <circle cx="76" cy="82" r="36" fill="url(#cv-face)" />
      <circle cx="76" cy="82" r="36" fill="none" stroke="#0f766e" strokeWidth="1.6" />
      {ticks.map((i) => {
        const angle = (i / 12) * Math.PI * 2;
        const long = i % 3 === 0;
        const r1 = long ? 27 : 30;
        return (
          <line
            key={i}
            x1={(76 + Math.cos(angle) * r1).toFixed(1)}
            y1={(82 + Math.sin(angle) * r1).toFixed(1)}
            x2={(76 + Math.cos(angle) * 34).toFixed(1)}
            y2={(82 + Math.sin(angle) * 34).toFixed(1)}
            stroke="#115e59"
            strokeWidth={long ? 2.4 : 1.2}
            strokeLinecap="round"
          />
        );
      })}
      <g className="boss-hand boss-hand-slow">
        <path d="M76 82 L76 58" stroke="#134e4a" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <g className="boss-hand">
        <path d="M76 82 L76 52" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
        <path d="M76 52 L73 58 L79 58Z" fill="#0f766e" />
      </g>
      {/* the eye in the hub */}
      <g className="boss-eye">
        <circle cx="76" cy="82" r="7" fill="#042f2e" />
        <circle cx="76" cy="82" r="4.4" fill="#2dd4bf" />
        <circle cx="76" cy="82" r="14" fill="#2dd4bf" opacity=".25" />
        <circle cx="77.4" cy="80.6" r="1.4" fill="#fff" />
      </g>
      {/* sand trickling out */}
      <path d="M20 134 Q30 150 22 158 M34 138 Q42 150 38 158" fill="none" stroke="#fde68a" strokeWidth="1.6" strokeLinecap="round" opacity=".55" className="boss-core" />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// 7. Nemesis Prime: your own shadow, wrapped in a void rift
// ---------------------------------------------------------------------------------------------
function NemesisPrime() {
  return (
    <>
      <defs>
        <radialGradient id="np-void" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#050010" />
          <stop offset="0.6" stopColor="#3b0764" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f0abfc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="np-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2e1065" />
          <stop offset="0.5" stopColor="#0b0218" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>
      {/* void rift behind */}
      <g className="boss-rot">
        <ellipse cx="80" cy="80" rx="74" ry="66" fill="url(#np-void)" />
        <ellipse cx="80" cy="80" rx="62" ry="22" fill="none" stroke="#e879f9" strokeWidth="1" opacity=".5" transform="rotate(30 80 80)" />
        <ellipse cx="80" cy="80" rx="62" ry="22" fill="none" stroke="#f0abfc" strokeWidth="0.8" opacity=".4" transform="rotate(-30 80 80)" />
      </g>
      {/* shards */}
      <g className="boss-rock">
        <path d="M18 40 L28 30 L30 48Z M134 34 L146 44 L132 54Z" fill="#c026d3" opacity=".8" />
      </g>
      <g className="boss-rock boss-rock-2">
        <path d="M12 110 L24 100 L26 118Z M138 108 L150 118 L136 126Z" fill="#a21caf" opacity=".8" />
      </g>
      {/* cape of void */}
      <g className="boss-sway">
        <path d="M50 70 Q24 110 30 154 L48 140 L60 156 L80 142 L100 156 L112 140 L130 154 Q136 110 110 70Z" fill="url(#np-body)" />
        <path d="M30 154 L48 140 L60 156 L80 142 L100 156 L112 140 L130 154" fill="none" stroke="#f0abfc" strokeWidth="1.2" opacity=".7" />
      </g>
      {/* body */}
      <g className="boss-breathe">
        <path d="M54 72 Q80 64 106 72 L102 122 Q80 130 58 122Z" fill="url(#np-body)" />
        <path d="M54 72 Q80 64 106 72" fill="none" stroke="#f5d0fe" strokeWidth="1.6" opacity=".85" />
        <path d="M60 84 L100 84 M62 100 L98 100 M64 114 L96 114" stroke="#c026d3" strokeWidth="1" opacity=".5" />
        <path d="M80 80 L90 94 L80 112 L70 94Z" fill="none" stroke="#f0abfc" strokeWidth="1.2" className="boss-core" />
        <circle cx="80" cy="94" r="3" fill="#fdf4ff" className="boss-core" />
      </g>
      {/* arms ending in blades of light */}
      <path d="M54 76 Q36 92 32 116" fill="none" stroke="#0b0218" strokeWidth="9" strokeLinecap="round" />
      <path d="M106 76 Q124 92 128 116" fill="none" stroke="#0b0218" strokeWidth="9" strokeLinecap="round" />
      <path d="M54 76 Q36 92 32 116 M106 76 Q124 92 128 116" fill="none" stroke="#f0abfc" strokeWidth="1" opacity=".7" />
      <path d="M32 116 L26 146 L38 118Z" fill="#fdf4ff" className="boss-core" />
      <path d="M128 116 L134 146 L122 118Z" fill="#fdf4ff" className="boss-core" />
      {/* head */}
      <path d="M58 52 Q56 22 80 18 Q104 22 102 52 Q100 68 80 72 Q60 68 58 52Z" fill="url(#np-body)" />
      <path d="M58 52 Q56 22 80 18" fill="none" stroke="#f5d0fe" strokeWidth="1.6" opacity=".85" />
      <path d="M62 18 L56 2 L70 14 M98 18 L104 2 L90 14" fill="#0b0218" stroke="#f0abfc" strokeWidth="1" strokeLinejoin="round" />
      <g className="boss-eye">
        <path d="M64 46 L76 50 L64 53Z" fill="#fff" />
        <path d="M96 46 L84 50 L96 53Z" fill="#fff" />
        <ellipse cx="70" cy="50" rx="12" ry="6" fill="#f0abfc" opacity=".35" />
        <ellipse cx="90" cy="50" rx="12" ry="6" fill="#f0abfc" opacity=".35" />
      </g>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Registry + the component the UI uses
// ---------------------------------------------------------------------------------------------

type BossTheme = { main: string; glow: string; Art: () => ReactNode; particle: string };

const DEFAULT_THEME: BossTheme = { main: "#ef4444", glow: "#dc2626", Art: AbyssalDemon, particle: "#fb7185" };

const BOSS_THEMES: Record<string, BossTheme> = {
  "Prokrastinasi Abyssal": DEFAULT_THEME,
  "Echo Titan": { main: "#f97316", glow: "#ea580c", Art: EchoTitan, particle: "#fdba74" },
  "Gravemind Regent": { main: "#38bdf8", glow: "#0284c7", Art: GravemindRegent, particle: "#bae6fd" },
  "Wrath of Stagnation": { main: "#c084fc", glow: "#9333ea", Art: WrathOfStagnation, particle: "#f0abfc" },
  "The Hollow Crown": { main: "#facc15", glow: "#ca8a04", Art: HollowCrown, particle: "#fef08a" },
  "Chronovore": { main: "#2dd4bf", glow: "#0d9488", Art: Chronovore, particle: "#99f6e4" },
  "Nemesis Prime": { main: "#e879f9", glow: "#a21caf", Art: NemesisPrime, particle: "#f5d0fe" },
};

export function getBossTheme(bossName: string | null | undefined): BossTheme {
  return (bossName && BOSS_THEMES[bossName]) || DEFAULT_THEME;
}

/** Kept for compatibility: a bare SVG of the boss without the effect layers. */
export function getBossSprite(bossName: string): React.ComponentType<BossSpriteProps> {
  const { Art } = getBossTheme(bossName);
  return function BossSvg({ className = "", style, isHit = false }: BossSpriteProps) {
    return (
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ ...style, ...(isHit ? { filter: "brightness(2) saturate(0)" } : {}) }}
      >
        <Art />
      </svg>
    );
  };
}

// Fixed positions so server and client render identical markup.
const SPARKS = Array.from({ length: 12 }, (_, index) => ({
  left: 8 + ((index * 53) % 84),
  delay: (index % 6) * 0.7,
  duration: 3.4 + (index % 4) * 0.8,
  size: 3 + (index % 3) * 1.5,
}));

type BossArtProps = {
  name: string | null | undefined;
  /** Rendered width in px; the art is square. */
  size?: number | string;
  isHit?: boolean;
  enraged?: boolean;
  defeated?: boolean;
  className?: string;
};

/**
 * The boss with its aura, ground glow and rising particles. Pure CSS animation, so it costs
 * nothing while idle and respects prefers-reduced-motion.
 */
export function BossArt({ name, size = "100%", isHit = false, enraged = false, defeated = false, className = "" }: BossArtProps) {
  const theme = getBossTheme(name);
  const { Art } = theme;
  const main = enraged ? "#fbbf24" : theme.main;
  const glow = enraged ? "#f59e0b" : theme.glow;

  const filter = defeated
    ? "grayscale(1) brightness(0.55)"
    : isHit
      ? "brightness(2.2) saturate(0.3)"
      : `drop-shadow(0 0 10px ${glow}88)`;

  return (
    <div
      className={`boss-art ${enraged ? "boss-art--enraged" : ""} ${defeated ? "boss-art--defeated" : ""} ${className}`}
      style={{ width: size, aspectRatio: "1 / 1", ["--boss-main" as string]: main, ["--boss-glow" as string]: glow, ["--boss-particle" as string]: theme.particle } as CSSProperties}
    >
      <div className="boss-art__aura" />
      <div className="boss-art__ground" />
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="boss-art__svg" style={{ filter, transition: "filter 0.12s" }}>
        <Art />
      </svg>
      {!defeated &&
        SPARKS.map((spark, index) => (
          <i
            key={index}
            className="boss-art__spark"
            style={{ left: `${spark.left}%`, width: spark.size, height: spark.size, animationDelay: `${spark.delay}s`, animationDuration: `${spark.duration}s` }}
          />
        ))}
    </div>
  );
}

export const BOSS_AURA_COLORS: Record<string, { main: string; glow: string }> = Object.fromEntries(
  Object.entries(BOSS_THEMES).map(([name, theme]) => [name, { main: theme.main, glow: theme.glow }])
);
