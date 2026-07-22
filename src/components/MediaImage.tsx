import React, { useState } from 'react';
import { useMedia } from '../context/MediaContext';

interface MediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageKey: string;
  defaultSrc: string;
  fallbackSrc?: string;
  alt?: string;
}

export const MediaImage: React.FC<MediaImageProps> = ({
  imageKey,
  defaultSrc,
  fallbackSrc = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) => {
  const { getMediaUrl, getMediaAlt } = useMedia();
  const [hasError, setHasError] = useState(false);

  const dynamicSrc = getMediaUrl(imageKey, defaultSrc);
  const dynamicAlt = alt || getMediaAlt(imageKey, alt);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        e.currentTarget.src = fallbackSrc;
      }
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={hasError ? fallbackSrc : (dynamicSrc || defaultSrc)}
      alt={dynamicAlt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...props}
    />
  );
};

export default MediaImage;
