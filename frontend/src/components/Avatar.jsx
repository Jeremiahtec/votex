export default function Avatar({ name, size = 'sm' }) {
  const getInitials = (str) => {
    if (!str) return '?';
    const names = str.split(' ');
    let init = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      init += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return init;
  };

  const getColors = (str) => {
    if (!str) return 'bg-slate-200 text-slate-500';
    // Simple hash to determine color
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
      'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl'
  };

  return (
    <div 
      className={`${sizes[size]} ${getColors(name)} rounded-full flex items-center justify-center font-bold shadow-sm select-none border border-black/5 dark:border-white/10`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
