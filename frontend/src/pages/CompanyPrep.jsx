import { useState, useEffect } from 'react';
import API from '../utils/api';

const topCompanies = [
  { name: 'Amazon', logo: '📦', industry: 'E-Commerce / Cloud', avgPackage: '20-40 LPA', roles: ['SDE', 'Data Engineer', 'TPM'] },
  { name: 'Google', logo: '🔍', industry: 'Technology', avgPackage: '25-50 LPA', roles: ['SWE', 'ML Engineer', 'PM'] },
  { name: 'Microsoft', logo: '🪟', industry: 'Technology', avgPackage: '20-45 LPA', roles: ['SWE', 'Cloud Engineer', 'PM'] },
  { name: 'Infosys', logo: '🔷', industry: 'IT Services', avgPackage: '3.6-8 LPA', roles: ['Systems Engineer', 'Senior SE', 'Tech Lead'] },
  { name: 'TCS', logo: '🔹', industry: 'IT Services', avgPackage: '3.5-7 LPA', roles: ['Assistant System Engineer', 'Systems Engineer'] },
  { name: 'Wipro', logo: '🟦', industry: 'IT Services', avgPackage: '3.5-7 LPA', roles: ['Project Engineer', 'SE'] },
  { name: 'Accenture', logo: '🔺', industry: 'Consulting', avgPackage: '4.5-10 LPA', roles: ['Application Developer', 'Analyst'] },
  { name: 'Flipkart', logo: '🛒', industry: 'E-Commerce', avgPackage: '18-35 LPA', roles: ['SDE', 'Data Scientist', 'PM'] },
];

const defaultCompanyData = (name) => ({
  hiringProcess: [
    { step: 1, title: 'Online Assessment', description: 'Aptitude + Coding test', duration: '60-90 mins' },
    { step: 2, title: 'Technical Round 1', description: 'DSA & Problem Solving', duration: '45-60 mins' },
    { step: 3, title: 'Technical Round 2', description: 'System Design & CS Fundamentals', duration: '45-60 mins' },
    { step: 4, title: 'HR Round', description: 'Cultural fit, behavioral questions', duration: '30 mins' },
  ],
  requiredSkills: ['Data Structures & Algorithms', 'Problem Solving', 'Object-Oriented Programming', 'Database Management'],
  preparationRoadmap: [
    { week: 1, topics: ['Arrays', 'Strings', 'Time Complexity Analysis'], resources: ['LeetCode Easy Problems'] },
    { week: 2, topics: ['Linked Lists', 'Stacks', 'Queues'], resources: ['GeeksforGeeks'] },
    { week: 3, topics: ['Trees', 'Binary Search Trees', 'Heaps'], resources: ['LeetCode Medium Problems'] },
    { week: 4, topics: ['Graphs', 'BFS/DFS', 'Dynamic Programming'], resources: ['Company-specific LeetCode list'] },
  ],
  previousQuestions: [
    { question: 'Reverse a linked list', category: 'DSA' },
    { question: 'Find the maximum subarray sum', category: 'DSA' },
    { question: 'Implement a stack using queues', category: 'DSA' },
    { question: 'Difference between process and thread', category: 'OS' },
    { question: 'Explain ACID properties in databases', category: 'DBMS' },
  ],
});

export default function CompanyPrep() {
  const [selected, setSelected] = useState(topCompanies[0]);
  const [companyData, setCompanyData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState('process');
  const [targetRole, setTargetRole] = useState('');

  useEffect(() => {
    if (selected) {
      API.get(`/companies/${selected.name}`).then(r => {
        setCompanyData(r.data.company);
      }).catch(() => {
        setCompanyData(defaultCompanyData(selected.name));
      });
      setRoadmap(null);
      setTargetRole('');
    }
  }, [selected]);

  const generateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const { data } = await API.post(`/companies/${selected.name}/roadmap`, { targetRole: targetRole || selected.roles[0], weeks: 6 });
      setRoadmap(data.roadmap);
      setActiveTab('roadmap');
    } catch {
      setRoadmap({ roadmap: defaultCompanyData(selected.name).preparationRoadmap, importantTopics: ['DSA', 'System Design', 'DBMS', 'OS', 'CN'] });
      setActiveTab('roadmap');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const data = companyData || defaultCompanyData(selected?.name);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="section-heading">🏢 Company Preparation</h1>
        <p className="text-gray-400 text-sm mt-1">Company-specific hiring process, questions, and AI-generated preparation roadmaps.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Company list */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Top Companies</p>
          {topCompanies.map(c => (
            <button key={c.name} onClick={() => setSelected(c)} className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${selected?.name === c.name ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'}`}>
              <span className="text-2xl">{c.logo}</span>
              <div>
                <p className="text-white text-sm font-medium">{c.name}</p>
                <p className="text-gray-500 text-xs">{c.avgPackage}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Company header */}
          <div className="card flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selected?.logo}</span>
                <div>
                  <h2 className="font-display font-bold text-white text-xl">{selected?.name}</h2>
                  <p className="text-gray-400 text-sm">{selected?.industry}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {selected?.roles?.map(r => <span key={r} className="badge-primary">{r}</span>)}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-field text-sm py-2 w-40">
                <option value="">Select Role</option>
                {selected?.roles?.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button onClick={generateRoadmap} disabled={generatingRoadmap} className="btn-primary text-sm">
                {generatingRoadmap ? '🤖 Generating...' : '🗺️ AI Roadmap'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/[0.06]">
            {['process', 'skills', 'questions', 'roadmap'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                {tab === 'process' ? 'Hiring Process' : tab === 'questions' ? 'Prev. Questions' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'process' && (
            <div className="space-y-3">
              {data.hiringProcess?.map((step, i) => (
                <div key={i} className="card flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold shrink-0">{step.step}</div>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                    {step.duration && <span className="badge-warning mt-2">{step.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Required Skills for {selected?.name}</h3>
              <div className="flex flex-wrap gap-2">
                {data.requiredSkills?.map(s => <span key={s} className="badge-primary px-3 py-1.5">{s}</span>)}
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-3">
              {data.previousQuestions?.map((q, i) => (
                <div key={i} className="card">
                  <div className="flex items-center gap-3">
                    <span className="badge-warning">{q.category}</span>
                    <p className="text-gray-300 text-sm">{q.question}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'roadmap' && (
            roadmap ? (
              <div className="space-y-4">
                {roadmap.importantTopics?.length > 0 && (
                  <div className="card">
                    <p className="text-primary-400 text-xs uppercase tracking-wide mb-3">🎯 Key Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.importantTopics.map(t => <span key={t} className="badge-primary">{t}</span>)}
                    </div>
                  </div>
                )}
                {(roadmap.roadmap || data.preparationRoadmap)?.map((w, i) => (
                  <div key={i} className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold text-sm">{w.week}</span>
                      <span className="text-white font-medium">Week {w.week}{w.focus ? ` – ${w.focus}` : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">{w.topics?.map(t => <span key={t} className="text-gray-300 text-sm bg-white/[0.04] px-2.5 py-1 rounded-lg">{t}</span>)}</div>
                    {w.resources?.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{w.resources.map(r => <span key={r} className="text-gray-500 text-xs">📚 {r}</span>)}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-400 mb-4">Click "AI Roadmap" to generate a personalized preparation roadmap for {selected?.name}.</p>
                <button onClick={generateRoadmap} className="btn-primary mx-auto">Generate Roadmap</button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
