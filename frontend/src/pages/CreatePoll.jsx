import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [anonymous, setAnonymous] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(o => o);
    
    if (!title.trim()) return toast('Question is required.', 'error');
    if (validOptions.length < 2) return toast('At least 2 options are required.', 'error');
    if (validOptions.length > 10) return toast('Maximum 10 options allowed.', 'error');

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        options: validOptions,
        anonymous,
        ...(expiresAt && { expires_at: new Date(expiresAt).toISOString() })
      };
      const { data } = await api.post('/polls', payload);
      toast('Poll created successfully!', 'success');
      navigate(`/polls/${data.id}`);
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to create poll.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Min datetime-local value (now)
  const nowStr = new Date().toISOString().slice(0, 16);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Create a new poll</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Design your question, configure options, and launch.</p>
      </div>

      <Card className="p-1">
        <form onSubmit={handleSubmit} className="p-5 sm:p-8">
          
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">1. What are you asking?</h2>
            <Input 
              id="poll-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Should we migrate to Next.js or stick with React?"
              className="text-lg"
              autoFocus
            />
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">2. The Options</h2>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {idx + 1}
                  </div>
                  <Input 
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                  {options.length > 2 && (
                    <button 
                      type="button" 
                      onClick={() => removeOption(idx)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={addOption}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 mb-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">3. Settings</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Custom Expiration</label>
                <Input 
                  type="datetime-local"
                  value={expiresAt}
                  min={nowStr}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1.5">If blank, poll expires in exactly 30 minutes.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Privacy</label>
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">Anonymous Voting</span>
                    <span className="block text-xs text-slate-500">Hide voter identities completely.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              isLoading={submitting}
              className="w-full sm:w-auto"
            >
              Launch Poll
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
