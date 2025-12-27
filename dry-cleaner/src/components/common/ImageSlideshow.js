// src/components/common/ImageSlideshow.js
import React, { useState, useEffect, useRef } from 'react';
import './ImageSlideshow.css';

const ImageSlideshow = ({ 
  images = [], 
  interval = 4000, // 4 seconds
  transition = 'fade', // 'fade' or 'slide'
  autoplay = true,
  showCaptions = true,
  showIndicators = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const intervalRef = useRef(null);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imagePromises = images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.src = image.url;
      });
    });

    Promise.all(imagePromises);
  }, [images]);

  // Auto advance slideshow
  useEffect(() => {
    if (!autoplay || !imagesLoaded || images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, interval, currentIndex, imagesLoaded, images.length]);

  const goToNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToPrevious = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={`slideshow-placeholder ${className}`}>
        <div className="placeholder-content">
          <span className="placeholder-icon">📷</span>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-slideshow ${className}`}>
      {/* Slideshow Container */}
      <div className={`slideshow-container transition-${transition}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`slideshow-slide ${
              index === currentIndex ? 'active' : ''
            } ${isTransitioning ? 'transitioning' : ''}`}
            style={{
              backgroundImage: `url(${image.url})`,
              opacity: index === currentIndex ? 1 : 0,
              transform: transition === 'slide' 
                ? `translateX(${(index - currentIndex) * 100}%)` 
                : 'none'
            }}
          >
            {/* Image overlay for better text readability */}
            <div className="slide-overlay"></div>

            {/* Caption */}
            {showCaptions && image.caption && (
              <div className="slide-caption">
                <h3>{image.caption}</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows (only show if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button 
            className="slideshow-arrow arrow-left"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button 
            className="slideshow-arrow arrow-right"
            onClick={goToNext}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="slideshow-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {!imagesLoaded && (
        <div className="slideshow-loading">
          <div className="loading-spinner"></div>
          <p>Loading images...</p>
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;