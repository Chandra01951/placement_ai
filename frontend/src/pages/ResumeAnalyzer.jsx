import { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import ScoreCircle from '../components/common/ScoreCircle';

export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analysis');
  const fileRef = useRef();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await API.get('/resume');
      setResumes(data.resumes);
      if (data.resumes.length > 0 && !selected) setSelected(data.resumes[0]);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    setError('');
    try {
      const { data } = await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumes(p => [data.resume, ...p]);
      setSelected(data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const handleImprove = async () => {
    if (!selected) return;
    setImproving(true);
    try {
      const { data } = await API.post(`/resume/${selected._id}/improve`, { targetRole: 'Software Engineer' });
      setSelected(data.resume);
      setActiveTab('improvements');
    } catch (err) {
      setError(err.response?.data?.message || 'Improvement failed');
    } finally {
      setImproving(false);
    }
  };

  const ScoreBadge = ({ score, label }) => {
    const color = score >= 70 ? 'text-emerald-400 bg-emerald-500/10' : score >= 40 ? 'text-yellow-400 bg-yellow-500/10' : 'text-red-400 bg-red-500/10';
    return (
      <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        <div className={`text-3xl font-bold font-display ${color.split(' ')[0]}`}>{score}</div>
        <p className="text-gray-400 text-xs mt-1">{label}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-heading">📄 Resume Analyzer</h1>
          <p className="text-gray-400 text-sm mt-1">Upload your resume and get AI-powered feedback instantly.</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current.click()} disabled={uploading} className="btn-primary">
            {uploading ? '⏳ Analyzing...' : '+ Upload Resume'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      {uploading && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <h3 className="text-white font-semibold mb-2">Analyzing Your Resume...</h3>
          <p className="text-gray-400 text-sm">AI is checking ATS score, grammar, keywords, and more.</p>
          <div className="mt-4 w-48 h-1.5 bg-white/[0.05] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full animate-[shimmer_2s_infinite]" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {resumes.length === 0 && !uploading ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="font-display text-xl font-bold mb-2">No Resume Uploaded</h3>
          <p className="text-gray-400 text-sm mb-6">Upload your resume (PDF or DOCX) to get AI-powered analysis.</p>
          <button onClick={() => fileRef.current.click()} className="btn-primary mx-auto">Upload Your Resume</button>
        </div>
      ) : selected && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resume list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Your Resumes</h2>
            {resumes.map(r => (
              <button key={r._id} onClick={() => setSelected(r)} className={`w-full text-left p-4 rounded-xl border transition-all ${selected?._id === r._id ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'}`}>
                <p className="text-white text-sm font-medium truncate">{r.fileName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge-primary text-xs">{r.atsScore}% ATS</span>
                  <span className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Analysis */}
          <div className="lg:col-span-2 space-y-5">
            {/* Score overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white">{selected.fileName}</h2>
                <button onClick={handleImprove} disabled={improving} className="btn-primary text-sm">
                  {improving ? '✨ Improving...' : '✨ AI Improve'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ScoreBadge score={selected.resumeScore} label="Resume Score" />
                <ScoreBadge score={selected.atsScore} label="ATS Score" />
                <ScoreBadge score={selected.grammarScore} label="Grammar" />
                <ScoreBadge score={selected.formattingScore} label="Formatting" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/[0.06] pb-0">
              {['analysis', 'keywords', 'improvements'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'analysis' && (
              <div className="space-y-4">
                <div className="card">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">AI Summary</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{selected.aiFeedback?.summary}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="card">
                    <p className="text-emerald-400 text-xs uppercase tracking-wide mb-3">✅ Strengths</p>
                    <ul className="space-y-2">
                      {selected.aiFeedback?.strengths?.map((s, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="card">
                    <p className="text-red-400 text-xs uppercase tracking-wide mb-3">❌ Weaknesses</p>
                    <ul className="space-y-2">
                      {selected.aiFeedback?.weaknesses?.map((w, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <p className="text-yellow-400 text-xs uppercase tracking-wide mb-3">💡 Suggestions</p>
                  <ul className="space-y-2">
                    {selected.aiFeedback?.suggestions?.map((s, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-yellow-400 mt-0.5">{i + 1}.</span>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'keywords' && (
              <div className="card">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">Missing ATS Keywords</p>
                <p className="text-gray-400 text-sm mb-4">Add these keywords to improve your ATS score:</p>
                <div className="flex flex-wrap gap-2">
                  {selected.aiFeedback?.missingKeywords?.map((k, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{k}</span>
                  ))}
                </div>
                {selected.extractedSkills?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Skills Detected</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.extractedSkills.map((s, i) => (
                        <span key={i} className="badge-primary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'improvements' && (
              <div className="space-y-4">
                {selected.improvedSummary && (
                  <div className="card">
                    <p className="text-primary-400 text-xs uppercase tracking-wide mb-3">✨ Improved Summary</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{selected.improvedSummary}</p>
                  </div>
                )}
                {selected.improvedSkillsSection && (
                  <div className="card">
                    <p className="text-primary-400 text-xs uppercase tracking-wide mb-3">✨ Improved Skills Section</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{selected.improvedSkillsSection}</p>
                  </div>
                )}
                {!selected.improvedSummary && (
                  <div className="card text-center py-8">
                    <p className="text-gray-400">Click "AI Improve" to generate enhanced resume content.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
