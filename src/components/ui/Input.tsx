import { type InputHTMLAttributes, type ElementType, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ElementType;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-[var(--text-secondary)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={`bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none w-full transition-colors ${
              Icon ? 'pl-10' : ''
            } ${error ? 'border-[#DC3545] focus:border-[#DC3545] focus:ring-[#DC3545]' : ''} ${className}`}
            {...rest}
          />
        </div>
        {error && (
          <p className="text-[#DC3545] text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
