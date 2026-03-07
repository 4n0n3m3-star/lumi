'use client';

import React from 'react';
import Lenis from 'lenis';
import { ZoomParallax } from '@/components/ui/zoom-parallax';

export default function ZoomParallaxSection() {
	React.useEffect(() => {
		const lenis = new Lenis();

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	const images = [
		{
			src: '/media/DSCF4917.jpg',
			alt: 'LUMI Atelier — estúdio de tattoo',
		},
		{
			src: '/media/DSCF4915.jpg',
			alt: 'LUMI Atelier — estúdio de piercing',
		},
		{
			src: '/media/DSCF4304.jpg',
			alt: 'LUMI Atelier — espaço',
		},
		{
			src: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&auto=format&q=80',
			alt: 'Fine line tattoo detail',
		},
		{
			src: 'https://images.unsplash.com/photo-1590246814883-57c511e79503?w=800&h=800&fit=crop&auto=format&q=80',
			alt: 'Studio atmosphere',
		},
		{
			src: 'https://images.unsplash.com/photo-1612459284270-db6f5c9b0b1d?w=800&h=800&fit=crop&auto=format&q=80',
			alt: 'Tattoo artist at work',
		},
		{
			src: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=800&fit=crop&auto=format&q=80',
			alt: 'Botanical detail',
		},
	];

	return <ZoomParallax images={images} />;
}
