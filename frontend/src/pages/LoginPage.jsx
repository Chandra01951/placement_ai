import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-surface-900 border-r border-white/[0.06] p-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center font-bold text-xl">P</div>
          <span className="text-white font-bold font-display text-xl">PlacementAI</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            Your placement journey<br />
            <span className="gradient-text">starts here.</span>
          </h2>
          <div className="space-y-4">
            {['AI Resume Analysis & ATS scoring', 'AI-powered mock interviews', 'Company-specific preparation guides', 'Real-time placement readiness tracker'].map(f => (
              <div key={f} className="flex items-center gap-3 text-gray-300">
                <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm">© 2025 PlacementAI</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center font-bold">P</div>
              <span className="font-bold font-display">PlacementAI</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue your placement preparation.</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="you@college.edu" required
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  className="input-field pr-12" placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3 mt-2">
              {isLoading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-gray-500 text-center">
            Demo: <span className="text-gray-300">demo@placementai.com</span> / <span className="text-gray-300">demo123</span>
          </div>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
