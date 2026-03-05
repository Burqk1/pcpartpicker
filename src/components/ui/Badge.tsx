import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-header)] text-[var(--text-secondary)]',
  success: 'bg-[#28A745]/20 text-[#28A745]',
  warning: 'bg-[#FFC107]/20 text-[#FFC107]',
  error: 'bg-[#DC3545]/20 text-[#DC3545]',
  info: 'bg-[#0066FF]/20 text-[#6699FF]',
};

function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
