import { type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
}

function Select({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  className = '',
  ...rest
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[var(--text-secondary)] mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`appearance-none bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 pr-10 text-[var(--text-primary)] focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none w-full transition-colors cursor-pointer ${
            error ? 'border-[#DC3545] focus:border-[#DC3545] focus:ring-[#DC3545]' : ''
          } ${!value && placeholder ? 'text-[var(--text-secondary)]/50' : ''} ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <p className="text-[#DC3545] text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

export default Select;
