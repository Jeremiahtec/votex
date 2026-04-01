import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Activity, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast('Welcome back to VoteX!', 'success');
    } catch (err) {
      toast(err.response?.data?.error || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4 animate-fade-in">
      {/* Brand mark */}
      <Link to="/" className="flex items-center mb-10 group">
        <span className="text-2xl font-bold text-white tracking-tight">VoteX</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-card">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5">Sign in</h1>
            <p className="text-sm text-zinc-500">Pick up right where you left off.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              id="login-email"
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
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading} className="w-full group" size="lg">
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6 flex items-center justify-center gap-1.5">
          No account?{' '}
          <Link to="/register" className="font-semibold text-white hover:text-zinc-300 transition-colors flex items-center">
            Create one free <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </p>
      </div>
    </div>
  );
}
