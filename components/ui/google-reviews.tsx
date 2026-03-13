'use client';

import { useEffect, useRef, useState } from 'react';

interface Review {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  profile_photo_url: string;
  time: number;
}

interface ReviewsData {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="reviews-stars" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i <= rating ? 'var(--warm-brown)' : 'none'}
          stroke="var(--warm-brown)"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function GoogleReviews() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(true);
          return;
        }
        setData(d);
      })
      .catch(() => setError(true));
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Self-contained IntersectionObserver for fade-up elements
  useEffect(() => {
    if (!data || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    sectionRef.current.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  if (error || !data) return null;

  return (
    <div className="reviews-section" ref={sectionRef}>
      <div className="reviews-header fade-up">
        <div className="reviews-header-left">
          <svg className="reviews-google-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="reviews-rating-text">{data.rating.toFixed(1)}</span>
          <Stars rating={Math.round(data.rating)} />
          <span className="reviews-count">({data.totalReviews})</span>
        </div>
      </div>
      <div className="reviews-grid">
        {data.reviews.slice(0, 4).map((review, i) => (
          <div key={i} className={`review-card fade-up delay-${i + 1}`}>
            <div className="review-card-top">
              <div className="review-author-info">
                <span className="review-author">{review.author_name}</span>
                <span className="review-time">{review.relative_time_description}</span>
              </div>
              <Stars rating={review.rating} />
            </div>
            {review.text && (
              <p className="review-text">
                {review.text.length > 180
                  ? review.text.slice(0, 180).trim() + '…'
                  : review.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
