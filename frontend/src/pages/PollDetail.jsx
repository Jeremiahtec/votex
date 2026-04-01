import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import CountdownTimer from '../components/ui/CountdownTimer';
import Skeleton from '../components/ui/Skeleton';
import { Share2, Trash2, ArrowLeft, BarChart2, CheckCircle2 } from 'lucide-react';

export default function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isExpiredLocally, setIsExpiredLocally] = useState(false);

  useEffect(() => {
    api.get(`/polls/${id}`)
      .then(res => setPoll(res.data))
      .catch(err => {
        toast(err.response?.data?.error || 'Failed to open poll.', 'error');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, toast]);

  const handleVote = async () => {
    if (!selectedOption) return toast('Please select an option first.', 'error');
    if (isExpiredLocally) return toast('This poll is closed.', 'error');

    setSubmitting(true);
    try {
      await api.post(`/polls/${id}/vote`, { option_id: selectedOption });
      toast('Vote recorded!', 'success');
      navigate(`/polls/${id}/results`);
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to submit vote.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Link copied to clipboard!', 'success');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/polls/${id}`);
      toast('Poll deleted successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to delete poll.', 'error');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isExpired = isExpiredLocally || (poll?.expires_at && new Date(poll.expires_at) < new Date());

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-full mb-8" />
        <Card className="p-8">
          <Skeleton className="h-8 w-3/4 mb-10" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in">
      
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 relative z-10">
          <Button variant="secondary" size="sm" onClick={copyShareLink}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          {poll.created_by === user?.id && (
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)} className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 border-transparent">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        title="Delete Poll"
        description="Are you sure you want to delete this poll? This action cannot be undone and all votes will be permanently lost."
        confirmText="Delete Poll"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDanger={true}
        isLoading={deleting}
      />

      <Card className="p-1 border-0 shadow-saas-lg">
        <div className="bg-white dark:bg-surface-elevated rounded-2xl p-6 sm:p-10">
          
          <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Avatar name={poll.created_by_name || poll.created_by_email} size="md" />
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Asked by</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  {poll.created_by_name || poll.created_by_email?.split('@')[0]}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <CountdownTimer expiresAt={poll.expires_at} onExpire={() => setIsExpiredLocally(true)} />
              {poll.anonymous && (
                <span className="text-[10px] px-2 py-0.5 rounded-md text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-500/20 uppercase font-bold tracking-wider">
                  Anonymous Mode
                </span>
              )}
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8 leading-snug">
            {poll.title}
          </h1>

          <div className="space-y-4 mb-10">
            {poll.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => !isExpired && setSelectedOption(opt.id)}
                disabled={isExpired}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                  ${selectedOption === opt.id 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-900 dark:text-white' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-slate-500 shadow-sm'}
                  ${isExpired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="font-semibold text-lg">{opt.text}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${selectedOption === opt.id ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary-300'}
                `}>
                  {selectedOption === opt.id && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
            <Link to={`/polls/${id}/results`} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold text-sm transition-colors flex items-center w-full sm:w-auto justify-center sm:justify-start">
              <BarChart2 className="w-4 h-4 mr-2" />
              View Live Results
            </Link>
            
            <Button
              onClick={handleVote}
              disabled={!selectedOption || isExpired}
              isLoading={submitting}
              className="w-full sm:w-auto px-10 shadow-saas hover:shadow-saas-lg"
            >
              {isExpired ? 'Poll Closed' : 'Cast Vote'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
