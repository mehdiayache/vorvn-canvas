export default function GlobeSvg() {
  return (
    <svg
      className="text-mid opacity-70 shrink-0 w-7 h-7"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="0.9" />
      <ellipse cx="14" cy="14" rx="5.5" ry="12.5" stroke="currentColor" strokeWidth="0.9" />
      <ellipse cx="14" cy="14" rx="5.5" ry="12.5" transform="rotate(60 14 14)" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
      <ellipse cx="14" cy="14" rx="5.5" ry="12.5" transform="rotate(120 14 14)" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
      <line x1="1.5" y1="14" x2="26.5" y2="14" stroke="currentColor" strokeWidth="0.9" />
      <path d="M3.5 8.5 Q14 10 24.5 8.5" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
      <path d="M3.5 19.5 Q14 18 24.5 19.5" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
    </svg>
  );
}
