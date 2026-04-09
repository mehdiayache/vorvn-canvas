export default function EyeSvg() {
  return (
    <svg
      className="absolute top-1/2 -translate-y-1/2 text-foreground opacity-[0.05] [html[data-theme='light']_&]:opacity-[0.07] pointer-events-none"
      style={{
        right: 'calc(var(--gutter) * -0.2)',
        width: 'clamp(260px, 46vw, 740px)',
      }}
      viewBox="0 0 700 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 175 C175 24 525 24 688 175 C525 326 175 326 12 175 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="350" cy="175" r="72" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="350" cy="175" r="24" stroke="currentColor" strokeWidth="0.75" fill="none" />
      <circle cx="350" cy="175" r="5" fill="currentColor" />
    </svg>
  );
}
