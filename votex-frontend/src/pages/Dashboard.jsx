import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import CountdownTimer from '../components/ui/CountdownTimer.jsx';
import { LayoutGrid, AlertCircle, TrendingUp, Archive, Plus, Activity } from 'lucide-react';

function StatCard({ label, value, icon: Icon, colorClass, borderClass, isLoading }) {
  return (
    <Card className={`relative overflow-hidden group ${borderClass}`}>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
          <div className={`p-2 rounded-xl bg-white dark:bg-surface-elevated shadow-sm border border-slate-100 dark:border-slate-700 ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-24 rounded-lg" />
        ) : (
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
        )}
      </div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500 ${colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
    </Card>
  );
}

function PollCard({ poll }) {
  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
  
  return (
    <Card hoverable className="flex flex-col h-full animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug line-clamp-2 min-h-[56px]">
          {poll.title}
        </h3>
        <div className="shrink-0 pt-1">
          {poll.anonymous && (
            <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
              Anon
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2.5 mb-5 mt-auto">
        <Avatar name={poll.created_by_name || poll.created_by_email} size="sm" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {poll.created_by_name || 'Anonymous'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-surface-dark px-2.5 py-1 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          {poll.vote_count} Vote{poll.vote_count !== '1' ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-surface-dark px-2.5 py-1 rounded-lg">
          <LayoutGrid className="w-3.5 h-3.5" />
          {poll.option_count} Options
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        {!isExpired ? (
          <CountdownTimer expiresAt={poll.expires_at} />
        ) : (
          <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-full">Expired</span>
        )}

        <div className="flex gap-2">
          {isExpired ? (
            <Link to={`/polls/${poll.id}/results`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              Results →
            </Link>
          ) : (
            <Link to={`/polls/${poll.id}`} className="text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-500/10 px-4 py-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors">
              Vote Now
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'expired' | 'my'
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get('/polls').then(r => setPolls(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  
  // Computations
  const activePolls = polls.filter(p => !p.expires_at || new Date(p.expires_at) >= now);
  const expiredPolls = polls.filter(p => p.expires_at && new Date(p.expires_at) < now);
  const myPolls = polls.filter(p => p.created_by_email === user?.email);
  const totalLifetimeVotes = polls.reduce((a, p) => a + parseInt(p.vote_count || 0), 0);

  const displayedPolls = 
    activeTab === 'active' ? activePolls :
    activeTab === 'expired' ? expiredPolls :
    myPolls;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome back, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Here's what's happening across all active polls today.</p>
        </div>
        <Link to="/polls/new" className="shrink-0">
          <Button variant="primary" className="w-full sm:w-auto shadow-saas hover:shadow-saas-lg">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard 
          label="Active Polls" 
          value={activePolls.length} 
          icon={Activity} 
          colorClass="text-emerald-500"
          borderClass="border-emerald-100 dark:border-emerald-500/20"
          isLoading={loading} 
        />
        <StatCard 
          label="Total Votes" 
          value={totalLifetimeVotes} 
          icon={TrendingUp} 
          colorClass="text-primary-600 dark:text-primary-400"
          borderClass="border-primary-100 dark:border-primary-500/20"
          isLoading={loading} 
        />
        <StatCard 
          label="My Polls" 
          value={myPolls.length} 
          icon={LayoutGrid} 
          colorClass="text-amber-500"
          borderClass="border-amber-100 dark:border-amber-500/20"
          isLoading={loading} 
        />
        <StatCard 
          label="Expired" 
          value={expiredPolls.length} 
          icon={Archive} 
          colorClass="text-slate-500"
          borderClass="border-slate-200 dark:border-slate-800"
          isLoading={loading} 
        />
      </div>

      {/* Dynamic Tabs */}
      <div className="flex gap-1 mb-8 p-1 bg-slate-100 dark:bg-surface-elevated rounded-xl inline-flex w-full sm:w-auto overflow-x-auto">
        {[
          { id: 'active', label: 'Active Polls' },
          { id: 'expired', label: 'Expired Polls' },
          { id: 'my', label: 'My Polls' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Polling List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Card key={i} className="h-64 flex flex-col justify-between">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full mt-4" />
            </Card>
          ))}
        </div>
      ) : displayedPolls.length === 0 ? (
        <Card className="flex flex-col items-center justify-center min-h-[400px] text-center bg-slate-50/50 dark:bg-surface-elevated/50 border-dashed border-2">
          <div className="w-16 h-16 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No polls found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
            {activeTab === 'active' ? "There are currently no active polls on the platform." :
             activeTab === 'expired' ? "No polls have expired yet. They are removed 24h after completion." :
             "You haven't authored any polls yet."}
          </p>
          <Link to="/polls/new">
            <Button variant="primary">Create Your First Poll</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedPolls.map(p => <PollCard key={p.id} poll={p} />)}
        </div>
      )}
    </div>
  );
}
