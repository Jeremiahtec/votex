export default function Card({ children, className = '', hoverable = false, padding = true, ...props }) {
  return (
    <div 
      className={[
        'bg-zinc-900 border border-zinc-800 rounded-2xl',
        'shadow-card',
        padding ? 'p-5 sm:p-6' : '',
        hoverable
          ? 'transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-card-hover'
          : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
