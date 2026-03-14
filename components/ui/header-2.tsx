'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

const navLinks = [
	{ label: 'Serviços', href: '#services' },
	{ label: 'Arte', href: '#art' },
];

const navLinksRight = [
	{ label: 'Reservar', href: 'book', accent: true },
	{ label: 'Artistas', href: 'artists' },
];

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	// Close menu on resize to desktop
	React.useEffect(() => {
		const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	// Close menu on escape
	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	return (
		<>
			<header
				className={cn(
					'lumi-header sticky top-0 z-50 mx-auto w-full border-b border-transparent md:border md:rounded-md md:transition-all md:duration-500 md:ease-out',
					scrolled && !open && 'lumi-header--scrolled md:top-4 md:max-w-4xl md:rounded-full md:shadow-lg',
					!scrolled && 'md:max-w-full',
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
					<button
						onClick={() => setOpen(!open)}
						className="md:hidden ml-auto"
						aria-label={open ? 'Close menu' : 'Open menu'}
						style={{
							background: 'transparent',
							border: 'none',
							cursor: 'pointer',
							padding: 8,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<MenuToggleIcon open={open} />
					</button>
				</nav>
			</header>

			{/* Mobile dropdown — glass blur, not fullscreen */}
			<div
				className="md:hidden"
				style={{
					position: 'fixed',
					top: 56,
					right: 16,
					left: 16,
					zIndex: 49,
					pointerEvents: open ? 'auto' : 'none',
				}}
			>
				<div
					style={{
						background: 'rgba(250, 247, 241, 0.85)',
						backdropFilter: 'blur(24px)',
						WebkitBackdropFilter: 'blur(24px)',
						borderRadius: 16,
						border: '1px solid rgba(191, 160, 140, 0.2)',
						boxShadow: '0 8px 40px rgba(63, 47, 36, 0.1), 0 2px 8px rgba(63, 47, 36, 0.04)',
						padding: '28px 32px',
						opacity: open ? 1 : 0,
						transform: open ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.97)',
						transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						{[...navLinks, ...navLinksRight].map((link, i) => (
							<a
								key={link.label}
								href={link.href}
								onClick={() => setOpen(false)}
								style={{
									display: 'block',
									padding: '10px 0',
									fontFamily: "'Montserrat', sans-serif",
									fontSize: '0.7rem',
									fontWeight: 500,
									letterSpacing: '0.2em',
									textTransform: 'uppercase' as const,
									color: 'accent' in link && link.accent ? 'var(--warm-brown)' : 'var(--taupe)',
									textDecoration: 'none',
									transition: 'color 0.25s ease',
									opacity: open ? 1 : 0,
									transform: open ? 'translateY(0)' : 'translateY(8px)',
									transitionDelay: open ? `${80 + i * 50}ms` : '0ms',
									transitionProperty: 'opacity, transform, color',
									transitionDuration: '0.4s, 0.4s, 0.25s',
									transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
								}}
							>
								{link.label}
							</a>
						))}
					</div>

					<div
						style={{
							marginTop: 20,
							paddingTop: 20,
							borderTop: '1px solid rgba(191, 160, 140, 0.15)',
							display: 'flex',
							gap: 24,
							opacity: open ? 1 : 0,
							transform: open ? 'translateY(0)' : 'translateY(8px)',
							transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
							transitionDelay: open ? '280ms' : '0ms',
						}}
					>
						<a
							href="https://instagram.com/lumi.atelier_"
							target="_blank"
							rel="noopener noreferrer"
							style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--rose-taupe)', textDecoration: 'none' }}
						>
							@lumi.atelier_
						</a>
						<a
							href="mailto:studio@lumiatelier.pt"
							style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--rose-taupe)', textDecoration: 'none' }}
						>
							studio@lumiatelier.pt
						</a>
					</div>
				</div>
			</div>

			{/* Backdrop overlay */}
			{open && (
				<div
					className="md:hidden"
					onClick={() => setOpen(false)}
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 48,
						background: 'rgba(30, 23, 19, 0.1)',
						backdropFilter: 'blur(2px)',
						WebkitBackdropFilter: 'blur(2px)',
					}}
				/>
			)}
		</>
	);
}
