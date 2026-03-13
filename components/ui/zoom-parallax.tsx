'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[36vh] [&>div]:!left-[22vw] [&>div]:!h-[20vh] [&>div]:!w-[26vw]' : ''} ${index === 2 ? '[&>div]:!-top-[20vh] [&>div]:!-left-[36vw] [&>div]:!h-[28vh] [&>div]:!w-[18vw]' : ''} ${index === 3 ? '[&>div]:!left-[36vw] [&>div]:!h-[18vh] [&>div]:!w-[18vw]' : ''} ${index === 4 ? '[&>div]:!top-[30vh] [&>div]:!left-[14vw] [&>div]:!h-[18vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[30vh] [&>div]:!-left-[34vw] [&>div]:!h-[18vh] [&>div]:!w-[22vw]' : ''} ${index === 6 ? '[&>div]:!top-[26vh] [&>div]:!left-[38vw] [&>div]:!h-[12vh] [&>div]:!w-[12vw]' : ''} `}
						>
							<div className="relative h-[22vh] w-[26vw]">
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
