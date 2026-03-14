'use client';

import React from 'react';

interface ImageAutoSliderProps {
  images?: { src: string; alt: string }[];
}

export function ImageAutoSlider({ images: customImages }: ImageAutoSliderProps) {
  const defaultImages = [
    { src: '/media/IMG_5994.jpg', alt: 'LUMI Atelier — sala de tattoo' },
    { src: '/media/DSCF4915.jpg', alt: 'LUMI Atelier — estúdio de piercing' },
    { src: '/media/IMG_5995.jpg', alt: 'LUMI Atelier — sala de consulta' },
    { src: '/media/IMG_5997.jpg', alt: 'LUMI Atelier — espelho e lounge' },
    { src: '/media/DSCF4304.jpg', alt: 'LUMI Atelier — detalhe do espaço' },
    { src: '/media/DSCF4917.jpg', alt: 'LUMI Atelier — detalhe de tattoo' },
    { src: '/media/502993212_17851067253464581_3699851566995191396_n.jpeg', alt: 'LUMI Atelier — trabalho' },
    { src: '/media/RJPHOTOGRAPHY-136.jpg', alt: 'LUMI Atelier — retrato' },
    { src: '/media/IMG_5996.jpg', alt: 'LUMI Atelier — detalhe' },
  ];

  const images = customImages || defaultImages;
  const duplicatedImages = [...images, ...images];

  return (
    <div
      className="image-slider-wrap w-full relative overflow-hidden"
      style={{ background: 'var(--cream-light, #FAF7F1)', padding: '4rem 0' }}
    >
      <div className="image-slider-mask w-full">
        <div className="image-slider-track flex gap-4 w-max">
          {duplicatedImages.map((image, index) => (
            <div
              key={index}
              className="image-slider-item flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 'clamp(180px, 22vw, 320px)',
                height: 'clamp(240px, 30vw, 420px)',
                boxShadow: '0 4px 24px rgba(63, 47, 36, 0.08)',
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
