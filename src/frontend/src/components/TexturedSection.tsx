import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface TexturedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'hero' | 'tile' | 'banner';
}

export default function TexturedSection({ children, className, variant = 'tile' }: TexturedSectionProps) {
  const backgroundImage = {
    hero: "url('/assets/generated/hero-bg.dim_2400x1350.png')",
    tile: "url('/assets/generated/texture-tile.dim_1024x1024.png')",
    banner: "url('/assets/generated/page-banner.dim_2400x600.png')",
  }[variant];

  return (
    <div
      className={cn('relative bg-cover bg-center', className)}
      style={{ backgroundImage }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      <div className="relative">{children}</div>
    </div>
  );
}
