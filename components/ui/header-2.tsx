'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

const navLinks = [
	{ label: 'Serviços', href: '#services' },
	{ label: 'Arte', href: '#art' },
];

const navLinksRight = [
	{ label: 'Reservar', href: 'book.html', accent: true },
	{ label: 'Artistas', href: 'artists.html' },
];

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => { document.body.style.overflow = ''; };
	}, [open]);

	return (
		<header
			className={cn(
				'lumi-header sticky top-0 z-50 mx-auto w-full border-b border-transparent md:border md:rounded-md md:transition-all md:duration-500 md:ease-out',
				scrolled && !open && 'lumi-header--scrolled md:top-4 md:max-w-4xl md:rounded-full md:shadow-lg',
				!scrolled && 'md:max-w-full',
				open && 'lumi-header--open',
			)}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-6 md:px-10 md:transition-all md:duration-500 md:ease-out',
					scrolled && !open && 'md:h-12 md:px-6',
				)}
			>
				{/* Left links */}
				<div className="hidden md:flex items-center gap-1 flex-1">
					{navLinks.map((link, i) => (
						<a
							key={i}
							className="nav-roll"
							href={link.href}
							style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--taupe)', padding: '0 12px' }}
						>
							<span data-text={link.label}>{link.label}</span>
						</a>
					))}
				</div>

				{/* Center icon */}
				<a href="/" className="lumi-header-star">
					<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, color: 'var(--warm-brown)' }}>
						<path d="M50 2 Q57 43 98 50 Q57 57 50 98 Q43 57 2 50 Q43 43 50 2 Z" />
					</svg>
				</a>

				{/* Right links */}
				<div className="hidden md:flex items-center gap-1 flex-1 justify-end">
					{navLinksRight.map((link, i) => (
						<a
							key={i}
							className="nav-roll"
							href={link.href}
							style={{
								fontSize: '0.75rem',
								fontWeight: 500,
								letterSpacing: '0.18em',
								textTransform: 'uppercase' as const,
								color: link.accent ? 'var(--warm-brown)' : 'var(--taupe)',
								padding: '0 12px',
							}}
						>
							<span data-text={link.label}>{link.label}</span>
						</a>
					))}
				</div>

				{/* Mobile menu button */}
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setOpen(!open)}
					className="md:hidden ml-auto"
					style={{ color: 'var(--text)', background: 'transparent', border: 'none' }}
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			{/* Mobile menu */}
			<div
				className={cn(
					'lumi-mobile-menu fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden md:hidden',
					open ? 'block' : 'hidden',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-2 p-6',
					)}
				>
					<div className="grid gap-y-1">
						{[...navLinks, ...navLinksRight].map((link) => (
							<a
								key={link.label}
								href={link.href}
								onClick={() => setOpen(false)}
								style={{ display: 'block', padding: '12px 0', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--taupe)' }}
							>
								{link.label}
							</a>
						))}
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid var(--cream)', paddingTop: 24 }}>
						<a href="https://instagram.com/lumi.atelier_" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--taupe)' }}>
							@lumi.atelier_
						</a>
						<a href="mailto:studio@lumiatelier.com" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--taupe)' }}>
							studio@lumiatelier.com
						</a>
					</div>
				</div>
			</div>
		</header>
	);
}
