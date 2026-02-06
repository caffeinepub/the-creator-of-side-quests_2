import { ReactNode } from 'react';
import TexturedSection from './TexturedSection';

interface PageHeaderBannerProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHeaderBanner({ title, subtitle, children }: PageHeaderBannerProps) {
  return (
    <TexturedSection variant="banner" className="py-16">
      <div className="container">
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="text-lg text-muted-foreground md:text-xl">{subtitle}</p>}
        {children}
      </div>
    </TexturedSection>
  );
}
