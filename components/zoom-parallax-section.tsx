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
		{ src: '/media/IMG_5994.jpg', alt: 'LUMI Atelier — sala de tattoo' },
		{ src: '/media/DSCF4915.jpg', alt: 'LUMI Atelier — estúdio de piercing' },
		{ src: '/media/IMG_5995.jpg', alt: 'LUMI Atelier — sala de consulta' },
		{ src: '/media/IMG_5997.jpg', alt: 'LUMI Atelier — espelho e lounge' },
		{ src: '/media/DSCF4304.jpg', alt: 'LUMI Atelier — detalhe do espaço' },
		{ src: '/media/DSCF4917.jpg', alt: 'LUMI Atelier — detalhe de tattoo' },
		{ src: '/media/502993212_17851067253464581_3699851566995191396_n.jpeg', alt: 'LUMI Atelier — trabalho' },
		{ src: '/media/RJPHOTOGRAPHY-136.jpg', alt: 'LUMI Atelier — retrato' },
		{ src: '/media/IMG_5996.jpg', alt: 'LUMI Atelier — detalhe' },
		{ src: '/media/DSCF4304.jpg', alt: 'LUMI Atelier — ambiente' },
		{ src: '/media/IMG_5994.jpg', alt: 'LUMI Atelier — estúdio' },
	];

	return <ZoomParallax images={images} />;
}
