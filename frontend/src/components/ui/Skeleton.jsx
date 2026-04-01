export default function Skeleton({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`${rounded} ${className} bg-zinc-800 overflow-hidden relative`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #27272a 0%, #3f3f46 50%, #27272a 100%)',
        backgroundSize: '400% 100%',
        animation: 'shimmer 1.8s ease-in-out infinite',
      }}
    />
  );
}
