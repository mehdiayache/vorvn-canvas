/**
 * EyeLoader — compact breathing-eye spinner used while images load.
 * Inherits color via currentColor. No external deps.
 */
export default function EyeLoader({ size = 44 }: { size?: number }) {
  return (
    <span
      className="eye-loader inline-flex items-center justify-center text-foreground"
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    >
      <svg viewBox="0 0 114.3 80.9" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <path
          d="M114.3,40.6l-27.1-27.2-2.8-2.8c-3.8-3.4-8.2-6.2-13.1-8C66.9.9,62.2,0,57.2,0c-5,0-9.7.9-14.1,2.5-5.1,1.9-9.7,4.8-13.6,8.4l-1.9,1.9L0,40.3l27.6,27.7,1.9,1.9c3.9,3.6,8.5,6.5,13.5,8.4h0c4.4,1.6,9.1,2.5,14.1,2.6,4.9,0,9.7-.9,14.1-2.5h0c4.9-1.8,9.3-4.5,13.1-7.9h0c1-.9,1.9-1.8,2.8-2.8h0s0,0,0,0l27.2-27.1Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="57.1" cy="40.4" r="31.3" fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        <circle cx="57.1" cy="40.4" r="10" fill="currentColor">
          <animate attributeName="r" values="8;12;8" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;1;0.55" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </span>
  );
}
