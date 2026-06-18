export function LeafDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Main branch curving from bottom-left to top-right */}
      <path
        d="M-10 210 Q30 160 50 120 Q70 80 90 60 Q110 40 140 30 Q170 20 200 10"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.35"
      />
      
      {/* Secondary branch */}
      <path
        d="M40 140 Q60 110 80 95 Q100 80 120 75"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
        opacity="0.25"
      />
      
      {/* Tertiary branch */}
      <path
        d="M80 90 Q100 70 115 55 Q130 40 150 35"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.2"
      />

      {/* Leaves along main branch */}
      <ellipse cx="55" cy="118" rx="8" ry="4" transform="rotate(-35 55 118)" fill="currentColor" opacity="0.22" />
      <ellipse cx="72" cy="95" rx="9" ry="4.5" transform="rotate(-25 72 95)" fill="currentColor" opacity="0.28" />
      <ellipse cx="88" cy="72" rx="10" ry="5" transform="rotate(-20 88 72)" fill="currentColor" opacity="0.32" />
      <ellipse cx="108" cy="55" rx="9" ry="4.5" transform="rotate(-15 108 55)" fill="currentColor" opacity="0.3" />
      <ellipse cx="128" cy="42" rx="8" ry="4" transform="rotate(-10 128 42)" fill="currentColor" opacity="0.25" />
      <ellipse cx="148" cy="35" rx="7" ry="3.5" transform="rotate(-5 148 35)" fill="currentColor" opacity="0.2" />
      <ellipse cx="168" cy="28" rx="6" ry="3" transform="rotate(0 168 28)" fill="currentColor" opacity="0.18" />
      
      {/* Leaves on secondary branch */}
      <ellipse cx="60" cy="115" rx="7" ry="3.5" transform="rotate(30 60 115)" fill="currentColor" opacity="0.2" />
      <ellipse cx="78" cy="92" rx="8" ry="4" transform="rotate(25 78 92)" fill="currentColor" opacity="0.25" />
      <ellipse cx="98" cy="78" rx="7" ry="3.5" transform="rotate(20 98 78)" fill="currentColor" opacity="0.22" />
      <ellipse cx="118" cy="72" rx="6" ry="3" transform="rotate(15 118 72)" fill="currentColor" opacity="0.18" />
      
      {/* Leaves on tertiary branch */}
      <ellipse cx="95" cy="68" rx="7" ry="3.5" transform="rotate(-40 95 68)" fill="currentColor" opacity="0.18" />
      <ellipse cx="112" cy="52" rx="8" ry="4" transform="rotate(-30 112 52)" fill="currentColor" opacity="0.22" />
      <ellipse cx="132" cy="40" rx="7" ry="3.5" transform="rotate(-20 132 40)" fill="currentColor" opacity="0.2" />
      
      {/* Small accent dots / berries */}
      <circle cx="85" cy="105" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="105" cy="82" r="1.5" fill="currentColor" opacity="0.35" />
      <circle cx="125" cy="62" r="1.5" fill="currentColor" opacity="0.25" />
      <circle cx="145" cy="45" r="1.2" fill="currentColor" opacity="0.2" />
      
      {/* Extra delicate leaves for fullness */}
      <ellipse cx="45" cy="135" rx="6" ry="3" transform="rotate(-45 45 135)" fill="currentColor" opacity="0.15" />
      <ellipse cx="65" cy="105" rx="7" ry="3.5" transform="rotate(35 65 105)" fill="currentColor" opacity="0.18" />
      <ellipse cx="115" cy="48" rx="6" ry="3" transform="rotate(-25 115 48)" fill="currentColor" opacity="0.2" />
      <ellipse cx="138" cy="38" rx="5" ry="2.5" transform="rotate(10 138 38)" fill="currentColor" opacity="0.15" />
    </svg>
  );
}
