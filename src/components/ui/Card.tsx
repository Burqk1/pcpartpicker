import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

function Card({ children, className = '', hover = false, ...rest }: CardProps) {
  const baseClasses =
    'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg overflow-hidden';

  const hoverClasses = hover
    ? 'hover:border-[var(--link-color)] transition-all cursor-pointer'
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Card;
