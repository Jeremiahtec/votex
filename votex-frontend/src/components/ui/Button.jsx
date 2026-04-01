import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  disabled, 
  type = 'button',
  ...props 
}, ref) => {
  
  const base = [
    'inline-flex items-center justify-center font-semibold rounded-xl select-none',
    'transition-all duration-200 active:scale-[0.97]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
    'disabled:opacity-40 disabled:pointer-events-none',
  ].join(' ');

  const variants = {
    primary: [
      'bg-indigo-600 text-white',
      'shadow-btn',
      'hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]',
    ].join(' '),

    secondary: [
      'bg-zinc-800 text-zinc-100 border border-zinc-700',
      'hover:bg-zinc-700 hover:border-zinc-600 hover:text-white',
    ].join(' '),

    ghost: [
      'bg-transparent text-zinc-400',
      'hover:bg-zinc-800 hover:text-zinc-100',
    ].join(' '),

    danger: [
      'bg-zinc-800 text-zinc-300 border border-zinc-700',
      'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40',
    ].join(' '),
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8   gap-1.5',
    md: 'text-sm px-4 py-2   h-10  gap-2',
    lg: 'text-sm px-6 py-2.5 h-11  gap-2',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin shrink-0" style={{ width: '1em', height: '1em' }} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
