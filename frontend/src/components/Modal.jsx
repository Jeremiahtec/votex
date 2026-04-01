import Button from './ui/Button';
import { X, Trash2, Check } from 'lucide-react';

export default function Modal({ 
  isOpen, title, description,
  confirmText, cancelText,
  onConfirm, onCancel,
  isDanger = false, isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} aria-hidden />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-card p-6 animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + title */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDanger ? 'bg-red-500/10 border border-red-500/20' : 'bg-zinc-500/10 border border-zinc-500/20'}`}>
          {isDanger ? <Trash2 className="w-5 h-5 text-red-500" /> : <Check className="w-5 h-5 text-zinc-400" />}
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8">{description}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading} className="flex-1">
            {cancelText || 'Cancel'}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className={`flex-1 ${isDanger ? '!bg-red-600 !text-white hover:!bg-red-500 !border-transparent' : ''}`}
          >
            {confirmText || 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
