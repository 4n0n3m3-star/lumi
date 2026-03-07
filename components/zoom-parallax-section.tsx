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
			src: '/media/parallax-piercing-detail.jpg',
			alt: 'LUMI Atelier — estúdio de tattoo',
		},
		{
			src: '/media/DSCF4915.jpg',
			alt: 'LUMI Atelier — estúdio de piercing',
		},
		{
			src: '/media/parallax-studio-detail.jpg',
			alt: 'LUMI Atelier — espaço',
		},
		{
			src: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&auto=format&q=80',
			alt: 'Fine line tattoo detail',
		},
		{
			src: '/media/DSCF4304.jpg',
			alt: 'LUMI Atelier — detalhe do espaço',
		},
		{
			src: '/media/DSCF4917.jpg',
			alt: 'LUMI Atelier — detalhe de piercing',
		},
		{
			src: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=800&fit=crop&auto=format&q=80',
			alt: 'Botanical detail',
		},
	];

	return <ZoomParallax images={images} />;
}
