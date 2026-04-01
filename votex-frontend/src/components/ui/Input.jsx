import { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, hint, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={[
          'w-full px-4 py-2.5 rounded-xl text-sm font-medium',
          'bg-zinc-900 text-zinc-100 placeholder-zinc-600',
          'border outline-none transition-all duration-200',
          'disabled:opacity-40 disabled:pointer-events-none',
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/25'
            : 'border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
        ].join(' ')}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
