import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<LinkProps, keyof ButtonBaseProps | 'to'> & {
    as: typeof Link;
    href: string;
    disabled?: boolean;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[#0066FF] hover:bg-[#0052CC] text-white',
  secondary:
    'border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]',
  success: 'bg-[#28A745] hover:bg-[#1e7e34] text-white',
  danger: 'bg-[#DC3545] hover:bg-[#a71d2a] text-white',
  ghost:
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...rest
  } = props;

  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (props.as === Link) {
    const { as: _as, href, disabled, variant: _v, size: _s, ...linkRest } = props as ButtonAsLink;
    if (disabled) {
      return (
        <span className={`${classes} opacity-50 cursor-not-allowed`}>
          {children}
        </span>
      );
    }
    return (
      <Link to={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { as: _as, variant: _v, size: _s, ...buttonRest } = rest as Omit<ButtonAsButton, 'children' | 'className'>;

  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}

export default Button;
