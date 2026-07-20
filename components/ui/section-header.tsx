import { type LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  badge: {
    icon: LucideIcon;
    text: string;
  };
  title: React.ReactNode;
  description: string;
}

export function SectionHeader({ badge, title, description }: SectionHeaderProps) {
  const Icon = badge.icon;

  return (
    <div className="mx-auto mb-16 max-w-2xl text-center">
      <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amauta-orange/15 bg-amauta-orange-light/30 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-amauta-orange-dark">
        <Icon className="h-3.5 w-3.5" />
        <span>{badge.text}</span>
      </span>
      <h2 className="mt-5 text-3xl font-black uppercase tracking-tight text-amauta-blue-dark sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base font-semibold leading-relaxed text-slate-700 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
