import { useEffect, useRef, useState } from 'react';
import EyeLoader from './EyeLoader';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  /** Loader size in px. Default 44. */
  loaderSize?: number;
  /** object-fit on the inner image. Default 'cover'. */
  objectFit?: 'cover' | 'contain';
  /** Optional inline style for the inner <img>. */
  imgStyle?: React.CSSProperties;
  /** If true, mounts the <img> immediately (skip intersection observer). */
  eager?: boolean;
};

/**
 * LoadingImage — universal smooth lazy-loaded image.
 * - IntersectionObserver: only mounts the <img> when it nears the viewport.
 * - Renders the breathing-eye loader on a darkened placeholder until decoded.
 * - Smooth fade-in once loaded.
 * - Use everywhere on the site instead of raw <img> for consistent UX.
 */
export default function LoadingImage({
  src,
  alt = '',
  className = '',
  loaderSize = 44,
  objectFit = 'cover',
  imgStyle,
  eager = false,
}: Props) {
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (eager || inView) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, inView]);

  return (
    <span
      ref={wrapRef}
      className={`relative block overflow-hidden bg-foreground/[0.12] ${className}`}
    >
      {!loaded && !errored && (
        <span className="absolute inset-0 flex items-center justify-center">
          <EyeLoader size={loaderSize} />
        </span>
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`block w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 480ms ease',
            ...imgStyle,
          }}
        />
      )}
    </span>
  );
}
