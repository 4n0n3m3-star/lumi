'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type MenuToggleProps = React.ComponentProps<'div'> & {
	open: boolean;
	duration?: number;
};

export function MenuToggleIcon({
	open,
	className,
	duration = 400,
	...props
}: MenuToggleProps) {
	const transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration * 0.6}ms ease`;

	return (
		<div
			className={cn('relative flex flex-col items-end justify-center gap-[5px]', className)}
			style={{ width: 20, height: 20 }}
			{...props}
		>
			<span
				style={{
					display: 'block',
					width: open ? 18 : 18,
					height: 1.5,
					borderRadius: 2,
					background: 'var(--taupe)',
					transition,
					transform: open ? 'translateY(3.25px) rotate(45deg)' : 'translateY(0) rotate(0)',
					transformOrigin: 'center',
				}}
			/>
			<span
				style={{
					display: 'block',
					width: open ? 18 : 12,
					height: 1.5,
					borderRadius: 2,
					background: 'var(--taupe)',
					transition,
					transform: open ? 'translateY(-3.25px) rotate(-45deg)' : 'translateY(0) rotate(0)',
					opacity: open ? 1 : 1,
					transformOrigin: 'center',
				}}
			/>
		</div>
	);
}
