import React, { useState, useEffect, useRef } from 'react';

interface AdvancedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  threshold?: number;
  rootMargin?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  blur?: boolean;
  lowResSrc?: string;
}

const AdvancedLazyImage: React.FC<AdvancedLazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f3f4f6',
  threshold = 0.1,
  rootMargin = '200px 0px', // Start loading 200px before image enters viewport
  objectFit = 'cover',
  blur = true,
  lowResSrc,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Set up Intersection Observer to detect when image enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          // Once the image is in view, disconnect the observer
          if (imageRef.current) {
            observer.unobserve(imageRef.current);
          }
        }
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [threshold, rootMargin]);

  // Reset state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
    setIsInView(false); // Reset view status
  }, [src]);

  // Choose which image source to display
  const imageSrc = isInView ? src : '';
  const lowQualitySrc = lowResSrc || ''; // Low res for initial display

  return (
    <div
      ref={imageRef}
      className={`overflow-hidden bg-gray-100 ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      {!isInView && (
        <div
          className="w-full h-full flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="animate-pulse w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      )}

      {isInView && !isLoaded && !error && lowResSrc && (
        <img
          src={lowQualitySrc}
          alt=""
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`} ${
            blur ? 'blur-sm' : ''
          }`}
          aria-hidden="true"
        />
      )}

      {isInView && !error ? (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
        />
      ) : error ? (
        <div
          className="flex items-center justify-center text-gray-400 w-full h-full"
          style={{ minHeight: '100px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
        </div>
      ) : null}
    </div>
  );
};

export default AdvancedLazyImage;