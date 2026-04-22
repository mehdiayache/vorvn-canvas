import { useState } from 'react';
import EyeLoader from './EyeLoader';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  loaderSize?: number;
};

/**
 * LoadingImage — renders a breathing-eye loader until the image is decoded.
 * On-demand: uses native lazy loading + async decoding.
 */
export default function LoadingImage({ src, alt = '', className = '', loaderSize = 44 }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <span className={`relative block bg-background ${className}`}>
      {!loaded && !errored && (
        <span className="absolute inset-0 flex items-center justify-center">
          <EyeLoader size={loaderSize} />
        </span>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className="block w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 420ms ease' }}
      />
    </span>
  );
}
