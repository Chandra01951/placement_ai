import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice';
import API from '../utils/api';

const skillOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB', 'Machine Learning', 'AWS', 'Docker', 'Git', 'REST APIs', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Spring Boot'];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    college: user?.college || '',
    degree: user?.degree || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    graduationYear: user?.graduationYear || '',
    technicalSkills: user?.technicalSkills || [],
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const toggleSkill = skill => setForm(p => ({
    ...p,
    technicalSkills: p.technicalSkills.includes(skill) ? p.technicalSkills.filter(s => s !== skill) : [...p.technicalSkills, skill],
  }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await API.put('/users/profile', form);
      dispatch(updateUser(data.user));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const completionFields = ['name', 'phone', 'college', 'branch', 'cgpa', 'linkedinUrl', 'githubUrl'];
  const filled = completionFields.filter(f => form[f]).length;
  const completion = Math.round((filled / completionFields.length) * 100) + (form.technicalSkills.length >= 3 ? 10 : 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">👤 Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Complete your profile to improve placement readiness.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Profile Completion</p>
          <p className="text-2xl font-bold font-display text-primary-400">{Math.min(completion, 100)}%</p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="card">
        <div className="progress-bar h-3 mb-2">
          <div className="progress-fill bg-gradient-to-r from-primary-600 to-primary-400" style={{ width: `${Math.min(completion, 100)}%` }} />
        </div>
        <p className="text-gray-500 text-xs">Complete your profile to get better AI recommendations and increase placement readiness.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar */}
        <div className="card flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-3xl font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="badge-primary capitalize">{user?.role}</span>
              {user?.isEmailVerified && <span className="badge-success">✓ Verified</span>}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-white">Personal Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Chennai, Tamil Nadu" />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-white">Academic Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">College / University</label>
              <input name="college" value={form.college} onChange={handleChange} className="input-field" placeholder="Anna University" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange} className="input-field" placeholder="B.E. / B.Tech" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Branch</label>
              <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Computer Science" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">CGPA</label>
              <input name="cgpa" type="number" value={form.cgpa} onChange={handleChange} className="input-field" placeholder="8.5" min="0" max="10" step="0.01" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Graduation Year</label>
              <select name="graduationYear" value={form.graduationYear} onChange={handleChange} className="input-field">
                <option value="">Select Year</option>
                {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map(skill => (
              <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.technicalSkills.includes(skill) ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'}`}>
                {form.technicalSkills.includes(skill) && '✓ '}{skill}
              </button>
            ))}
          </div>
          {form.technicalSkills.length > 0 && (
            <p className="text-primary-400 text-sm mt-3">{form.technicalSkills.length} skills selected</p>
          )}
        </div>

        {/* Social Links */}
        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-white">Social & Portfolio Links</h2>
          {[
            { name: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourname' },
            { name: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/yourname' },
            { name: 'portfolioUrl', label: 'Portfolio URL', placeholder: 'https://yourportfolio.com' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs text-gray-400 mb-1.5">{f.label}</label>
              <input name={f.name} value={form[f.name]} onChange={handleChange} className="input-field" placeholder={f.placeholder} />
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && <p className="text-emerald-400 text-sm">✅ Profile saved successfully!</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3.5">
          {saving ? 'Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </div>
  );
}
