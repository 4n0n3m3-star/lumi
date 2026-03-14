'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	images: Image[];
}

// Layout: center image + inner ring (small, tight) + outer ring (large, bleeds off)
// Mix of vertical, horizontal, and square aspect ratios
const imagePositions = [
	// 0: CENTER — horizontal, medium
	{ top: '-2vh', left: '-1vw', w: '22vw', h: '15vh' },

	// INNER RING — smaller images, tighter spacing
	// 1: top-left — vertical
	{ top: '-22vh', left: '-14vw', w: '11vw', h: '18vh' },
	// 2: top-right — square
	{ top: '-20vh', left: '14vw', w: '13vw', h: '13vh' },
	// 3: right — horizontal
	{ top: '3vh', left: '18vw', w: '16vw', h: '11vh' },
	// 4: bottom-right — vertical
	{ top: '20vh', left: '10vw', w: '11vw', h: '17vh' },
	// 5: bottom-left — square
	{ top: '19vh', left: '-13vw', w: '12vw', h: '12vh' },
	// 6: left — horizontal
	{ top: '1vh', left: '-20vw', w: '15vw', h: '10vh' },

	// OUTER RING — bigger images, some bleed off screen
	// 7: far top-left — large horizontal, bleeds
	{ top: '-38vh', left: '-36vw', w: '24vw', h: '16vh' },
	// 8: far top-right — large vertical, bleeds
	{ top: '-36vh', left: '34vw', w: '18vw', h: '26vh' },
	// 9: far bottom-left — large square, bleeds
	{ top: '34vh', left: '-34vw', w: '22vw', h: '22vh' },
	// 10: far bottom-right — large horizontal, bleeds
	{ top: '36vh', left: '30vw', w: '24vw', h: '15vh' },
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale7 = useTransform(scrollYProgress, [0, 1], [1, 7]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	// Center gets lowest scale, inner ring medium, outer ring highest
	const scales = [
		scale4,  // 0: center
		scale5, scale5, scale5, scale5, scale5, scale5,  // 1-6: inner ring
		scale8, scale8, scale9, scale9,  // 7-10: outer ring
	];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];
					const pos = imagePositions[index % imagePositions.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className="absolute top-0 flex h-full w-full items-center justify-center"
						>
							<div
								className="overflow-hidden rounded-xl"
								style={{
									width: pos.w,
									height: pos.h,
									position: 'relative',
									top: pos.top,
									left: pos.left,
								}}
							>
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
