import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'navy' | 'danger' | 'ghost';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-turmeric text-ink hover:bg-turmeric-deep border border-[#C48A0A] font-semibold',
  secondary: 'bg-white text-navy border border-navy hover:bg-paper font-semibold',
  navy: 'bg-navy text-white hover:bg-navy-deep font-semibold border border-navy-deep',
  danger: 'bg-urgent text-white hover:bg-red-800 font-semibold',
  ghost: 'bg-transparent text-ink-muted hover:bg-border/30 hover:text-ink',
};

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-[2px] px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
