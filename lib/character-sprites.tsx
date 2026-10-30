export type SpriteProps = {
  className?: string;
  style?: React.CSSProperties;
};

// Shared look: every class is lit from the top-left with a coloured rim light, and has a few
// parts that animate on their own (.spr-* classes live in globals.css).

export function SageSprite({ className = "", style }: SpriteProps) {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <defs>
        <linearGradient id="sage-robe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d3fd1" />
          <stop offset="0.55" stopColor="#3b1f8a" />
          <stop offset="1" stopColor="#1a0f45" />
        </linearGradient>
        <linearGradient id="sage-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b34b8" />
          <stop offset="1" stopColor="#24124f" />
        </linearGradient>
        <radialGradient id="sage-orb" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ecfeff" />
          <stop offset="0.45" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="sage-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="146" rx="40" ry="7" fill="#7c3aed" opacity=".28" />
      <circle cx="60" cy="86" r="56" fill="url(#sage-aura)" className="spr-glow" />

      <g className="spr-bob">
        {/* staff */}
        <rect x="98" y="38" width="3.4" height="112" rx="1.7" fill="#7a5a34" />
        <rect x="98" y="38" width="1.2" height="112" rx="0.6" fill="#b08850" opacity=".7" />
        <path d="M94 44 Q100 38 106 44" fill="none" stroke="#a78bfa" strokeWidth="1.4" />
        <g className="spr-orb">
          <path d="M99.7 14 L107 28 L99.7 42 L92.4 28Z" fill="url(#sage-orb)" />
          <path d="M99.7 14 L107 28 L99.7 28Z" fill="#fff" opacity=".35" />
          <circle cx="99.7" cy="28" r="12" fill="#22d3ee" opacity=".22" className="spr-glow" />
        </g>

        {/* robe */}
        <g className="spr-sway">
          <path d="M30 152 Q24 108 38 84 Q49 72 60 70 Q71 72 82 84 Q96 108 90 152 Q60 159 30 152Z" fill="url(#sage-robe)" />
          <path d="M60 72 L60 154" stroke="#2a1366" strokeWidth="1.2" opacity=".6" />
          <path d="M30 152 Q60 159 90 152" fill="none" stroke="#c4b5fd" strokeWidth="1.6" opacity=".85" />
          <path d="M28 144 Q60 151 92 144" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity=".5" />
          <path d="M41 100 Q60 108 79 100" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M60 99 L65 105 L60 111 L55 105Z" fill="#fde68a" />
          <path d="M60 99 L65 105 L60 105Z" fill="#fff" opacity=".5" />
          {/* runes */}
          <path d="M44 126 l2 3 l-2 3 l-2 -3z M74 130 l2 3 l-2 3 l-2 -3z M58 138 l1.6 2.4 l-1.6 2.4 l-1.6 -2.4z" fill="#c4b5fd" opacity=".75" className="spr-glow" />
        </g>

        {/* left sleeve + hand holding a small orb */}
        <path d="M38 88 Q22 100 24 120 Q32 124 40 116 Q42 102 46 92Z" fill="url(#sage-robe)" />
        <path d="M24 120 Q32 124 40 116" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity=".7" />
        <g className="spr-orb spr-orb2">
          <circle cx="18" cy="106" r="6" fill="url(#sage-orb)" opacity=".95" />
          <circle cx="18" cy="106" r="11" fill="#a78bfa" opacity=".25" className="spr-glow" />
        </g>

        {/* right arm to staff */}
        <path d="M82 88 Q97 98 99 112 Q91 118 83 110 Q80 100 76 92Z" fill="url(#sage-robe)" />
        <circle cx="99.6" cy="112" r="4.2" fill="#e9d5ff" opacity=".9" />

        {/* hood */}
        <path d="M36 54 Q33 22 60 15 Q87 22 84 54 Q82 70 60 74 Q38 70 36 54Z" fill="url(#sage-hood)" />
        <path d="M36 54 Q33 22 60 15" fill="none" stroke="#c4b5fd" strokeWidth="1.3" opacity=".75" />
        <path d="M44 52 Q45 35 60 33 Q75 35 76 52 Q74 65 60 67 Q46 65 44 52Z" fill="#06030f" />
        <path d="M44 52 Q45 35 60 33" fill="none" stroke="#7c3aed" strokeWidth="1" opacity=".6" />
        <g className="spr-blink">
          <ellipse cx="52.5" cy="51" rx="4" ry="2.6" fill="#22d3ee" />
          <ellipse cx="67.5" cy="51" rx="4" ry="2.6" fill="#22d3ee" />
          <ellipse cx="52.5" cy="51" rx="9" ry="6" fill="#22d3ee" opacity=".22" className="spr-glow" />
          <ellipse cx="67.5" cy="51" rx="9" ry="6" fill="#22d3ee" opacity=".22" className="spr-glow" />
          <ellipse cx="53" cy="50.4" rx="1.6" ry="1" fill="#fff" />
          <ellipse cx="68" cy="50.4" rx="1.6" ry="1" fill="#fff" />
        </g>
        {/* hood star clasp */}
        <path d="M60 19 L62 24 L67 24 L63 27.5 L64.6 32.5 L60 29.5 L55.4 32.5 L57 27.5 L53 24 L58 24Z" fill="#fde68a" opacity=".95" />
      </g>

      {/* drifting sparkles */}
      <circle cx="26" cy="64" r="1.6" fill="#e9d5ff" className="spr-orb" />
      <circle cx="92" cy="70" r="1.3" fill="#a5f3fc" className="spr-orb spr-orb2" />
      <circle cx="14" cy="88" r="1.1" fill="#c4b5fd" className="spr-orb spr-orb2" />
    </svg>
  );
}

export function IroncladSprite({ className = "", style }: SpriteProps) {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <defs>
        <linearGradient id="iron-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="0.4" stopColor="#7b8798" />
          <stop offset="1" stopColor="#2b3342" />
        </linearGradient>
        <linearGradient id="iron-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b5565" />
          <stop offset="1" stopColor="#161b26" />
        </linearGradient>
        <linearGradient id="iron-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f1f5f9" />
          <stop offset="0.5" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
        <radialGradient id="iron-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="148" rx="42" ry="7" fill="#dc2626" opacity=".25" />
      <circle cx="60" cy="86" r="58" fill="url(#iron-aura)" className="spr-glow" />

      <g className="spr-bob">
        {/* cape */}
        <g className="spr-sway">
          <path d="M34 78 Q22 120 28 152 Q60 146 92 152 Q98 120 86 78Z" fill="#7f1d1d" />
          <path d="M40 82 Q32 120 36 148 Q60 144 84 148 Q88 120 80 82Z" fill="#b91c1c" opacity=".7" />
        </g>

        {/* legs */}
        <path d="M43 124 L58 124 L57 150 L40 150Z" fill="url(#iron-dark)" />
        <path d="M62 124 L77 124 L80 150 L63 150Z" fill="url(#iron-dark)" />
        <path d="M40 140 L57 140 L58 152 L38 152Z" fill="url(#iron-steel)" />
        <path d="M63 140 L80 140 L82 152 L62 152Z" fill="url(#iron-steel)" />

        {/* torso */}
        <path d="M37 76 L83 76 L79 126 Q60 134 41 126Z" fill="url(#iron-steel)" />
        <path d="M60 76 L60 130" stroke="#1e293b" strokeWidth="1.4" opacity=".6" />
        <path d="M41 96 Q60 104 79 96" fill="none" stroke="#475569" strokeWidth="1.2" />
        <path d="M42 110 Q60 118 78 110" fill="none" stroke="#475569" strokeWidth="1.2" />
        <path d="M60 84 L67 94 L60 106 L53 94Z" fill="#dc2626" />
        <path d="M60 84 L67 94 L60 94Z" fill="#fca5a5" opacity=".6" />
        <path d="M41 126 Q60 134 79 126 L78 132 Q60 140 42 132Z" fill="#b91c1c" />

        {/* pauldrons */}
        <path d="M24 84 Q22 70 38 70 L44 84 Q34 92 24 84Z" fill="url(#iron-steel)" />
        <path d="M96 84 Q98 70 82 70 L76 84 Q86 92 96 84Z" fill="url(#iron-steel)" />
        <path d="M25 80 Q32 72 40 74" fill="none" stroke="#fff" strokeWidth="1" opacity=".5" />
        <path d="M27 86 Q34 90 43 85" fill="none" stroke="#dc2626" strokeWidth="1.6" />
        <path d="M93 86 Q86 90 77 85" fill="none" stroke="#dc2626" strokeWidth="1.6" />

        {/* shield */}
        <path d="M6 92 L30 88 L32 120 Q20 136 6 122Z" fill="url(#iron-dark)" />
        <path d="M9 95 L28 92 L29.5 118 Q20 130 9 119Z" fill="url(#iron-steel)" />
        <path d="M18.5 98 L24 108 L18.5 120 L13 108Z" fill="#dc2626" />
        <path d="M18.5 98 L24 108 L18.5 108Z" fill="#fecaca" opacity=".5" />

        {/* sword */}
        <path d="M101.5 22 L107 28 L107.5 122 L100 122 L100.4 28Z" fill="url(#iron-blade)" />
        <path d="M103.8 28 L103.8 122" stroke="#64748b" strokeWidth="0.8" />
        <rect x="94" y="121" width="21" height="4.5" rx="2" fill="#b45309" />
        <rect x="102" y="125" width="4.4" height="14" rx="1.6" fill="#78350f" />
        <circle cx="104.2" cy="142" r="3.2" fill="#fbbf24" />
        <path d="M101.5 22 L104 12 L107 28" fill="#fff" opacity=".35" className="spr-glow" />
        <path d="M82 84 Q100 92 103 118 Q94 122 86 112 Q82 100 78 90Z" fill="url(#iron-steel)" />
        <circle cx="104" cy="122" r="5" fill="#475569" />

        {/* helmet */}
        <rect x="52" y="64" width="16" height="12" rx="3" fill="url(#iron-dark)" />
        <path d="M40 54 Q38 22 60 18 Q82 22 80 54 L80 62 Q60 70 40 62Z" fill="url(#iron-steel)" />
        <path d="M42 34 Q60 24 78 34" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".5" />
        <path d="M44 46 L76 46 L74 56 Q60 62 46 56Z" fill="#090b11" />
        <g className="spr-blink">
          <path d="M49 49.5 L58 49.5 L58 53 L50 53Z" fill="#ef4444" />
          <path d="M62 49.5 L71 49.5 L70 53 L62 53Z" fill="#ef4444" />
          <path d="M46 51 L74 51" stroke="#ef4444" strokeWidth="5" opacity=".18" className="spr-glow" />
        </g>
        <path d="M60 18 L60 44" stroke="#475569" strokeWidth="1.4" />
        {/* plume */}
        <g className="spr-sway">
          <path d="M60 18 Q50 4 62 0 Q76 6 84 22 Q72 12 64 14Z" fill="#dc2626" />
          <path d="M62 2 Q72 6 80 20" fill="none" stroke="#fca5a5" strokeWidth="1" opacity=".7" />
        </g>
      </g>

      <circle cx="16" cy="70" r="1.4" fill="#fca5a5" className="spr-orb" />
      <circle cx="108" cy="62" r="1.2" fill="#fecaca" className="spr-orb spr-orb2" />
    </svg>
  );
}

export function PhantomSprite({ className = "", style }: SpriteProps) {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <defs>
        <linearGradient id="ph-cloak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4c2a9a" />
          <stop offset="0.5" stopColor="#241554" />
          <stop offset="1" stopColor="#0a0620" />
        </linearGradient>
        <linearGradient id="ph-blade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f3ff" />
          <stop offset="1" stopColor="#7c6cf0" />
        </linearGradient>
        <radialGradient id="ph-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="146" rx="38" ry="6" fill="#6d28d9" opacity=".3" />
      <circle cx="60" cy="86" r="56" fill="url(#ph-aura)" className="spr-glow" />

      <g className="spr-bob">
        {/* tattered cloak */}
        <g className="spr-sway">
          <path d="M28 150 Q20 106 36 82 Q48 70 60 68 Q72 70 84 82 Q100 106 92 150 L86 142 L80 154 L70 143 L60 156 L50 143 L40 154 L34 142Z" fill="url(#ph-cloak)" />
          <path d="M34 142 L40 154 L50 143 L60 156 L70 143 L80 154 L86 142" fill="none" stroke="#a78bfa" strokeWidth="1" opacity=".6" />
          <path d="M60 70 L60 150" stroke="#0a0620" strokeWidth="1.4" opacity=".6" />
        </g>

        {/* scarf tail */}
        <g className="spr-sway">
          <path d="M70 62 Q96 60 108 76 Q110 88 102 94 Q100 82 90 76 Q80 72 70 72Z" fill="#14b8a6" />
          <path d="M72 66 Q92 64 104 78" fill="none" stroke="#99f6e4" strokeWidth="1" opacity=".7" />
        </g>

        {/* daggers */}
        <g>
          <path d="M18 100 L30 118 L26 122 L12 106Z" fill="url(#ph-blade)" />
          <rect x="24" y="116" width="10" height="3" rx="1.4" transform="rotate(48 29 117.5)" fill="#5eead4" />
          <path d="M102 100 L90 118 L94 122 L108 106Z" fill="url(#ph-blade)" />
          <rect x="86" y="116" width="10" height="3" rx="1.4" transform="rotate(-48 91 117.5)" fill="#5eead4" />
          <path d="M18 100 L12 106" stroke="#fff" strokeWidth="1" opacity=".7" className="spr-glow" />
          <path d="M102 100 L108 106" stroke="#fff" strokeWidth="1" opacity=".7" className="spr-glow" />
        </g>
        <path d="M38 88 Q26 104 32 120 Q40 120 44 110 Q44 98 48 90Z" fill="url(#ph-cloak)" />
        <path d="M82 88 Q94 104 88 120 Q80 120 76 110 Q76 98 72 90Z" fill="url(#ph-cloak)" />
        <circle cx="33" cy="121" r="4" fill="#312e81" />
        <circle cx="87" cy="121" r="4" fill="#312e81" />

        {/* hood */}
        <path d="M36 56 Q32 22 60 14 Q88 22 84 56 Q82 72 60 76 Q38 72 36 56Z" fill="url(#ph-cloak)" />
        <path d="M36 56 Q32 22 60 14" fill="none" stroke="#c4b5fd" strokeWidth="1.2" opacity=".7" />
        <path d="M60 14 L60 20" stroke="#c4b5fd" strokeWidth="2" opacity=".6" />
        <path d="M44 54 Q46 36 60 34 Q74 36 76 54 Q74 64 60 66 Q46 64 44 54Z" fill="#04020c" />
        {/* mask */}
        <path d="M46 56 Q60 66 74 56 Q72 68 60 70 Q48 68 46 56Z" fill="#14b8a6" opacity=".9" />
        <path d="M50 60 Q60 66 70 60" fill="none" stroke="#042f2e" strokeWidth="1" opacity=".6" />
        <g className="spr-blink">
          <path d="M49 49 L58 51.5 L49 53.6Z" fill="#5eead4" />
          <path d="M71 49 L62 51.5 L71 53.6Z" fill="#5eead4" />
          <ellipse cx="53" cy="51.4" rx="9" ry="5" fill="#2dd4bf" opacity=".24" className="spr-glow" />
          <ellipse cx="67" cy="51.4" rx="9" ry="5" fill="#2dd4bf" opacity=".24" className="spr-glow" />
        </g>
      </g>

      {/* shadow wisps */}
      <path d="M14 140 Q8 126 16 114" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" opacity=".5" className="spr-glow" />
      <path d="M106 142 Q112 128 104 116" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" opacity=".5" className="spr-glow" />
      <circle cx="22" cy="66" r="1.4" fill="#c4b5fd" className="spr-orb" />
      <circle cx="100" cy="52" r="1.2" fill="#99f6e4" className="spr-orb spr-orb2" />
    </svg>
  );
}

export function MerchantSprite({ className = "", style }: SpriteProps) {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <defs>
        <linearGradient id="mer-coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b45309" />
          <stop offset="0.5" stopColor="#7c2d12" />
          <stop offset="1" stopColor="#3b1305" />
        </linearGradient>
        <linearGradient id="mer-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="mer-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c3a14" />
          <stop offset="1" stopColor="#2a1206" />
        </linearGradient>
        <radialGradient id="mer-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.42" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="147" rx="40" ry="7" fill="#d97706" opacity=".28" />
      <circle cx="60" cy="86" r="58" fill="url(#mer-aura)" className="spr-glow" />

      <g className="spr-bob">
        {/* coat */}
        <g className="spr-sway">
          <path d="M30 152 Q24 108 38 84 Q49 72 60 70 Q71 72 82 84 Q96 108 90 152 Q60 158 30 152Z" fill="url(#mer-coat)" />
          <path d="M60 72 L60 154" stroke="#2a0e04" strokeWidth="1.4" opacity=".6" />
          <path d="M30 152 Q60 158 90 152" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
        </g>
        {/* vest + buttons */}
        <path d="M44 80 L76 80 L74 130 Q60 136 46 130Z" fill="#fde68a" opacity=".92" />
        <path d="M60 80 L60 132" stroke="#92400e" strokeWidth="1" />
        <circle cx="55" cy="96" r="2" fill="url(#mer-gold)" />
        <circle cx="55" cy="108" r="2" fill="url(#mer-gold)" />
        <circle cx="55" cy="120" r="2" fill="url(#mer-gold)" />
        <path d="M40 112 Q60 120 80 112" fill="none" stroke="#451a03" strokeWidth="3" />
        <rect x="55" y="108" width="10" height="9" rx="1.6" fill="url(#mer-gold)" />

        {/* coin pouch */}
        <path d="M82 112 Q98 108 98 126 Q98 140 86 142 Q74 140 74 126 Q76 114 82 112Z" fill="#78350f" />
        <path d="M80 112 Q86 106 92 112" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
        <circle cx="86" cy="127" r="7" fill="url(#mer-gold)" opacity=".95" />
        <path d="M86 122 L86 132 M83 125 Q86 122 89 125 M83 129 Q86 132 89 129" fill="none" stroke="#92400e" strokeWidth="1" />

        {/* arms */}
        <path d="M38 88 Q22 100 26 120 Q34 123 41 114 Q42 100 46 92Z" fill="url(#mer-coat)" />
        <path d="M82 88 Q96 98 96 112 Q88 116 82 108 Q80 98 76 92Z" fill="url(#mer-coat)" />
        <circle cx="28" cy="122" r="4.6" fill="#f5d0a0" />

        {/* floating coin */}
        <g className="spr-orb">
          <ellipse cx="16" cy="100" rx="7" ry="7" fill="url(#mer-gold)" />
          <ellipse cx="16" cy="100" rx="4.6" ry="4.6" fill="none" stroke="#92400e" strokeWidth="1" />
          <path d="M16 96 L16 104" stroke="#92400e" strokeWidth="1" />
          <circle cx="16" cy="100" r="12" fill="#fbbf24" opacity=".25" className="spr-glow" />
        </g>

        {/* head */}
        <rect x="53" y="64" width="14" height="12" rx="3" fill="#e8c08a" />
        <ellipse cx="60" cy="52" rx="19" ry="20" fill="#f5d0a0" />
        <path d="M43 56 Q60 74 77 56 Q74 66 60 70 Q46 66 43 56Z" fill="#6b3a12" />
        <path d="M50 60 Q60 66 70 60 Q66 64 60 64 Q54 64 50 60Z" fill="#8a4b1a" />
        <g className="spr-blink">
          <ellipse cx="53" cy="49" rx="3.2" ry="3.6" fill="#1c0f05" />
          <ellipse cx="67" cy="49" rx="3.2" ry="3.6" fill="#1c0f05" />
          <circle cx="53.8" cy="47.8" r="1.1" fill="#fff" />
          <circle cx="67.8" cy="47.8" r="1.1" fill="#fff" />
        </g>
        <path d="M47 43 Q53 40 57 43 M63 43 Q67 40 73 43" fill="none" stroke="#6b3a12" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M57 56 Q60 58 63 56" fill="none" stroke="#a65f2a" strokeWidth="1.4" strokeLinecap="round" />

        {/* wide-brim hat with feather */}
        <ellipse cx="60" cy="38" rx="36" ry="9" fill="url(#mer-hat)" />
        <path d="M40 38 Q40 14 60 12 Q80 14 80 38Z" fill="url(#mer-hat)" />
        <path d="M40 34 Q60 40 80 34 L80 38 Q60 44 40 38Z" fill="url(#mer-gold)" />
        <path d="M42 24 Q60 16 78 24" fill="none" stroke="#c2742f" strokeWidth="1" opacity=".6" />
        <g className="spr-sway">
          <path d="M76 30 Q96 14 106 18 Q98 30 84 36Z" fill="#ef4444" />
          <path d="M80 30 Q94 20 103 19" fill="none" stroke="#fecaca" strokeWidth="1" opacity=".8" />
        </g>
      </g>

      <circle cx="104" cy="92" r="1.4" fill="#fde68a" className="spr-orb" />
      <circle cx="28" cy="70" r="1.2" fill="#fde68a" className="spr-orb spr-orb2" />
    </svg>
  );
}

export function getCharacterSprite(characterClass: string | null): React.ComponentType<SpriteProps> {
  switch (characterClass) {
    case "IRONCLAD": return IroncladSprite;
    case "SAGE":     return SageSprite;
    case "PHANTOM":  return PhantomSprite;
    case "MERCHANT": return MerchantSprite;
    default:         return SageSprite;
  }
}

export const CLASS_COLORS: Record<string, { primary: string; glow: string; accent: string }> = {
  IRONCLAD: { primary: "#dc2626", glow: "#ef4444", accent: "#fca5a5" },
  SAGE:     { primary: "#7c3aed", glow: "#8b5cf6", accent: "#c4b5fd" },
  PHANTOM:  { primary: "#6d28d9", glow: "#8b5cf6", accent: "#99f6e4" },
  MERCHANT: { primary: "#d97706", glow: "#f59e0b", accent: "#fcd34d" },
  DEFAULT:  { primary: "#7c3aed", glow: "#8b5cf6", accent: "#c4b5fd" },
};
