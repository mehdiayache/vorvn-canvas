/**
 * BreathingEye — minimal animated eye mark.
 * - Inherits color from currentColor (works in both themes).
 * - Eyelid uses surface color so blink reads on any background.
 * - Pupil softly dilates/contracts. Iris drifts subtly. Rare blink.
 */
export default function BreathingEye() {
  return (
    <div
      className="eye text-foreground"
      style={{ width: '100%', maxWidth: 340, aspectRatio: '1/1' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Sclera (almond outline) */}
        <path
          className="eye-sclera"
          d="M10 100 C 55 35, 145 35, 190 100 C 145 165, 55 165, 10 100 Z"
        />

        {/* Iris ring */}
        <circle className="eye-lens" cx="100" cy="100" r="38" />
        <circle className="eye-lens eye-iris-inner" cx="100" cy="100" r="22" />

        {/* Pupil — breathes */}
        <circle className="eye-pupil" cx="100" cy="100" r="7">
          <animate
            attributeName="r"
            values="7;9.5;7;6.2;7"
            dur="5.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Iris drift (very subtle horizontal scan) */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 4 0; -3 0; 0 0"
            dur="11s"
            repeatCount="indefinite"
            additive="sum"
          />
        </g>

        {/* Eyelid — rare blink. Uses --bg so it matches surface in any theme. */}
        <rect
          className="eye-lid"
          x="8"
          y="40"
          width="184"
          height="120"
        />
      </svg>

      <style>{`
        .eye svg { width: 100%; height: 100%; overflow: visible; display: block; }
        .eye-lens,
        .eye-sclera {
          fill: none;
          stroke: currentColor;
          stroke-width: 1.2;
          vector-effect: non-scaling-stroke;
        }
        .eye-iris-inner { stroke-width: 0.8; opacity: 0.6; }
        .eye-pupil { fill: currentColor; }

        .eye-lid {
          fill: hsl(var(--bg));
          transform: scaleY(0);
          transform-origin: 100px 100px;
          animation: eye-blink 7s ease-in-out infinite;
          animation-delay: 2.4s;
        }
        @keyframes eye-blink {
          0%, 92%, 100% { transform: scaleY(0); }
          94%, 95%      { transform: scaleY(1); }
          97%           { transform: scaleY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .eye-lid { animation: none; }
          .eye-pupil animate,
          .eye g animateTransform { display: none; }
        }
      `}</style>
    </div>
  );
}
