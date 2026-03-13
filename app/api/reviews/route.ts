import { NextResponse } from 'next/server';

const PLACE_ID = 'ChIJ-4wK2qfVHg0RO3AGqZtgosg';
const CACHE_TTL = 3600 * 1000; // 1 hour

let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  // Return cached if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Places API (New) v1 endpoint
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=pt`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json(
        { error: `Google API error: ${res.status}`, details: errBody },
        { status: 502 }
      );
    }

    const json = await res.json();

    const data = {
      rating: json.rating,
      totalReviews: json.userRatingCount,
      reviews: (json.reviews || []).map((r: Record<string, unknown>) => ({
        author_name: (r.authorAttribution as Record<string, string>)?.displayName || 'Anónimo',
        rating: r.rating,
        relative_time_description: r.relativePublishTimeDescription,
        text: (r.text as Record<string, string>)?.text || '',
        profile_photo_url: (r.authorAttribution as Record<string, string>)?.photoUri || '',
        time: r.publishTime,
      })),
    };

    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: String(err) },
      { status: 500 }
    );
  }
}
