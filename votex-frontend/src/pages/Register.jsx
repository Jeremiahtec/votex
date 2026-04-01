import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Activity, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.trim().length < 2) return toast('Name must be at least 2 characters.', 'error');
    if (form.password.length < 6) return toast('Password must be at least 6 characters.', 'error');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      login(data.token, data.user);
      toast('Account created! Enjoy voting 🎉', 'success');
      // Navigation handled automatically by GuestRoute
    } catch (err) {
      toast(err.response?.data?.error || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4 animate-fade-in">
      {/* Brand mark */}
      <Link to="/" className="flex items-center gap-2.5 mb-10 group">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-glow group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)] transition-shadow">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-black text-white tracking-tight">VoteX</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-card">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Free Account</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1.5">Create account</h1>
            <p className="text-sm text-zinc-500">Start creating and voting in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your name"
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
            <Input
              label="Email address"
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading} className="w-full group" size="lg">
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
