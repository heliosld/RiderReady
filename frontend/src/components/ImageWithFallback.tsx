'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon,
  containerClassName = ''
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center ${containerClassName}`}>
        {fallbackIcon || <Lightbulb className="w-12 h-12 text-gray-400" />}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`flex items-center justify-center ${containerClassName}`}>
          <div className="w-8 h-8 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
