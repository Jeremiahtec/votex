import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import Avatar from '../components/Avatar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { ArrowLeft, RefreshCw, Trophy, Share2, Inbox } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const copyShareLink = () => {
    const url = window.location.href.replace(/\/results$/, '');
    toast('Link copied to clipboard!', 'success');
  };

  const fetchResults = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await api.get(`/polls/${id}/results`);
      setData(res.data);
    } catch (err) {
      if (!isBackground) toast('Failed to load results.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(() => fetchResults(true), 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !data) {
    return (
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-full mb-8" />
        <Card className="p-8">
          <Skeleton className="h-8 w-3/4 mb-10" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return (
    <div className="pt-32 px-4 flex flex-col items-center animate-fade-in">
      <div className="w-24 h-24 bg-slate-100 dark:bg-surface-elevated rounded-3xl flex items-center justify-center mb-6 border border-border">
        <Inbox className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Poll not found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">This poll either never existed or was deleted by its creator.</p>
      <Link to="/dashboard" className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-shadow">Return Home</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Link>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={copyShareLink}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-elevated px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            Live updating
          </div>
        </div>
      </div>

      <Card className="p-1 border-0 shadow-saas-lg">
        <div className="bg-white dark:bg-surface-elevated rounded-2xl p-6 sm:p-10">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex gap-2 items-center mb-3">
                <span className="text-xs text-primary-600 dark:text-primary-400 uppercase tracking-widest font-bold">Final Results</span>
                {data.anonymous && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-500/20 uppercase font-bold tracking-wider">
                    Anonymous
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-6">
                {data.title}
              </h1>
              
              <div className="flex items-center gap-3">
                <Avatar name={data.created_by_name || data.created_by_email} size="md" />
                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Author</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {data.created_by_name || data.created_by_email?.split('@')[0]}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start sm:items-end shrink-0 bg-slate-50 dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-primary-700">
                {data.totalVotes}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Votes</div>
            </div>
          </div>

          <div className="space-y-6">
            {data.options.map((opt) => {
              const isWinner = data.totalVotes > 0 && opt.percentage === Math.max(...data.options.map(o => o.percentage));
              
              return (
                <div key={opt.id} className="relative group">
                  <div className="flex justify-between items-end mb-2 relative z-10 px-1">
                    <span className={`font-semibold flex items-center ${isWinner ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {opt.text}
                      {isWinner && <Trophy className="w-4 h-4 ml-2 text-zinc-500" />}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{opt.percentage}%</span>
                      <span className="text-xs text-slate-500 font-medium ml-2">{opt.vote_count} vote{opt.vote_count !== '1' ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  {/* Progress bar background */}
                  <div className="h-4 w-full bg-slate-100 dark:bg-surface-dark rounded-full overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-800/50">
                    {/* Actual progress */}
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{ 
                        width: `${Math.max(opt.percentage, 1)}%`,
                        background: isWinner 
                          ? 'linear-gradient(90deg, #a1a1aa 0%, #3f3f46 100%)' 
                          : 'var(--color-border)',
                        backgroundColor: !isWinner && '#52525b'
                      }}
                    >
                      {/* Shimmer effect inside the bar if it's the winner */}
                      {isWinner && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
