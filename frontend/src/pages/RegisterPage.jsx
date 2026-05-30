import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';

const branches = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Other'];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(s => s.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', college: '', branch: '', cgpa: '', graduationYear: new Date().getFullYear() + 1,
  });

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
  };

  const handleNext = e => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center font-bold text-lg">P</div>
          <span className="font-bold font-display text-xl">PlacementAI</span>
        </Link>

        <div className="card">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold">Create Your Account</h1>
            <p className="text-gray-400 text-sm mt-2">Start your placement preparation journey today</p>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-white/[0.05] text-gray-500'}`}>
                  {step > s ? '✓' : s}
                </div>
                <div className={`flex-1 h-0.5 ${s < 2 ? (step > s ? 'bg-primary-600' : 'bg-white/[0.05]') : 'hidden'}`} />
              </div>
            ))}
            <span className="text-xs text-gray-500">{step === 1 ? 'Personal Info' : 'Academic Details'}</span>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Ravi Kumar" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="ravi@college.edu" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Min. 6 characters" required minLength={6} />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3">Next →</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">College / University</label>
                <input type="text" name="college" value={form.college} onChange={handleChange} className="input-field" placeholder="Anna University" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Branch</label>
                  <select name="branch" value={form.branch} onChange={handleChange} className="input-field" required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">CGPA</label>
                  <input type="number" name="cgpa" value={form.cgpa} onChange={handleChange} className="input-field" placeholder="8.5" min="0" max="10" step="0.01" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Graduation Year</label>
                <select name="graduationYear" value={form.graduationYear} onChange={handleChange} className="input-field">
                  {[2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">← Back</button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-1 justify-center">
                  {isLoading ? 'Creating Account...' : 'Create Account 🎉'}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
