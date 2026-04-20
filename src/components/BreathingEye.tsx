import { useEffect, useRef } from 'react';
import './BreathingEye.css';

/**
 * BreathingEye — VORVN almond-lens eye mark.
 * - Inherits color from currentColor (theme-aware).
 * - Pupil dilates softly + tracks the cursor on hover-capable devices.
 * - Eyelid blinks rarely; uses page bg so it reads on any surface.
 */
export default function BreathingEye() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const root = rootRef.current;
    if (!root) return;
    const pupil = root.querySelector<SVGCircleElement>('.eye-pupil');
    if (!pupil) return;

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const r = root.getBoundingClientRect();
      if (r.width) {
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const angle = Math.atan2(dy, dx);
        const strength = Math.min(1, Math.hypot(dx, dy) / 300);
        const tx = Math.cos(angle) * 5 * strength;
        const ty = Math.sin(angle) * 5 * strength;
        cx += (tx - cx) * 0.09;
        cy += (ty - cy) * 0.09;
        pupil.setAttribute('transform', `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="eye text-foreground"
      style={{ width: '100%', maxWidth: 320 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 114.3 80.9" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="eye-clip">
            <circle cx="57.1" cy="40.4" r="31.3" />
          </clipPath>
        </defs>
        <path
          className="eye-lens"
          d="M114.3,40.6l-27.1-27.2-2.8-2.8c-3.8-3.4-8.2-6.2-13.1-8C66.9.9,62.2,0,57.2,0c-5,0-9.7.9-14.1,2.5-5.1,1.9-9.7,4.8-13.6,8.4l-1.9,1.9L0,40.3l27.6,27.7,1.9,1.9c3.9,3.6,8.5,6.5,13.5,8.4h0c4.4,1.6,9.1,2.5,14.1,2.6,4.9,0,9.7-.9,14.1-2.5h0c4.9-1.8,9.3-4.5,13.1-7.9h0c1-.9,1.9-1.8,2.8-2.8h0s0,0,0,0l27.2-27.1Z"
        />
        <circle className="eye-sclera" cx="57.1" cy="40.4" r="31.3" />
        <circle className="eye-pupil" cx="57.1" cy="40.4" r="10">
          <animate attributeName="r" values="10;11.5;10" dur="5.5s" repeatCount="indefinite" />
        </circle>
        <rect
          className="eye-lid"
          x="25.8"
          y="9.1"
          width="62.6"
          height="62.6"
          clipPath="url(#eye-clip)"
        />
      </svg>
    </div>
  );
}
