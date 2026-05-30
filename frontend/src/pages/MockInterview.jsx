import { useState } from 'react';
import API from '../utils/api';
import ScoreCircle from '../components/common/ScoreCircle';

const roles = ['Software Engineer', 'Data Analyst', 'Data Scientist', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Cloud Engineer'];
const types = [
  { value: 'mixed', label: 'Mixed (Technical + HR)', icon: '🎯' },
  { value: 'technical', label: 'Technical Only', icon: '💻' },
  { value: 'hr', label: 'HR Only', icon: '🤝' },
  { value: 'behavioral', label: 'Behavioral', icon: '🧠' },
];

export default function MockInterview() {
  const [stage, setStage] = useState('setup'); // setup | interview | results
  const [config, setConfig] = useState({ role: 'Software Engineer', type: 'mixed', difficulty: 'medium', questionCount: 5 });
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(120);

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/interview/generate', config);
      setInterview(data.interview);
      setCurrentQ(0);
      setAnswers([]);
      setAnswer('');
      setStage('interview');
      setTimer(120);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await API.post(`/interview/${interview._id}/answer`, {
        questionIndex: currentQ,
        answer,
        timeTaken: 120 - timer,
      });
      const newAnswers = [...answers, { answer, score: data.score, feedback: data.feedback }];
      setAnswers(newAnswers);
      setFeedback({ score: data.score, feedback: data.feedback });
      setAnswer('');
    } catch (err) {
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentQ < interview.questions.length - 1) {
      setCurrentQ(p => p + 1);
      setTimer(120);
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    setLoading(true);
    try {
      const { data } = await API.post(`/interview/${interview._id}/complete`);
      setInterview(data.interview);
      setStage('results');
    } catch (err) {
      alert('Failed to complete interview');
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'setup') return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="section-heading">🎤 AI Mock Interview</h1>
        <p className="text-gray-400 text-sm mt-1">Practice with AI-generated interview questions and get instant feedback.</p>
      </div>

      <div className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Target Role</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(r => (
              <button key={r} onClick={() => setConfig(p => ({ ...p, role: r }))} className={`p-3 text-sm rounded-xl border text-left transition-all ${config.role === r ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-300 hover:bg-white/[0.06]'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Interview Type</label>
          <div className="grid grid-cols-2 gap-2">
            {types.map(t => (
              <button key={t.value} onClick={() => setConfig(p => ({ ...p, type: t.value }))} className={`p-3 text-sm rounded-xl border text-left transition-all ${config.type === t.value ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-300 hover:bg-white/[0.06]'}`}>
                <span className="mr-2">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select value={config.difficulty} onChange={e => setConfig(p => ({ ...p, difficulty: e.target.value }))} className="input-field">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
            <select value={config.questionCount} onChange={e => setConfig(p => ({ ...p, questionCount: Number(e.target.value) }))} className="input-field">
              {[3, 5, 8, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>

        <button onClick={startInterview} disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
          {loading ? '🤖 Generating Questions...' : '🚀 Start Interview'}
        </button>
      </div>
    </div>
  );

  if (stage === 'interview' && interview) {
    const q = interview.questions[currentQ];
    const progress = ((currentQ) / interview.questions.length) * 100;

    return (
      <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-white">{interview.role} Interview</h1>
          <span className="badge-primary">Q {currentQ + 1} / {interview.questions.length}</span>
        </div>

        {/* Progress */}
        <div className="progress-bar"><div className="progress-fill bg-primary-500" style={{ width: `${progress}%` }} /></div>

        {/* Question */}
        <div className="card">
          <div className="flex items-start gap-3 mb-5">
            <span className={`badge ${q.category === 'technical' ? 'badge-primary' : q.category === 'hr' ? 'badge-success' : 'badge-warning'}`}>
              {q.category}
            </span>
            <span className={`badge ${q.difficulty === 'easy' ? 'badge-success' : q.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'}`}>
              {q.difficulty}
            </span>
          </div>
          <h2 className="font-display text-xl font-semibold text-white leading-relaxed">{q.question}</h2>
        </div>

        {/* Answer */}
        {!feedback ? (
          <div className="card space-y-4">
            <label className="text-sm text-gray-400">Your Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="input-field min-h-[150px] resize-none"
              placeholder="Type your answer here... Be specific and use examples."
            />
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">{answer.length} characters</span>
              <button onClick={submitAnswer} disabled={submitting || !answer.trim()} className="btn-primary">
                {submitting ? 'Evaluating...' : 'Submit Answer →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">AI Evaluation</h3>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold font-display ${feedback.score >= 70 ? 'text-emerald-400' : feedback.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{feedback.score}/100</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{feedback.feedback}</p>
            <button onClick={nextQuestion} className="btn-primary">
              {currentQ < interview.questions.length - 1 ? 'Next Question →' : '🏁 Finish Interview'}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'results' && interview) return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="card text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Interview Complete!</h1>
        <p className="text-gray-400 text-sm">{interview.role} • {interview.questions.length} Questions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(interview.scores || {}).map(([key, val]) => (
          <div key={key} className="card text-center">
            <div className="text-2xl font-bold font-display text-white">{val}</div>
            <p className="text-gray-400 text-xs mt-1 capitalize">{key}</p>
          </div>
        ))}
      </div>

      {interview.aiFeedback && (
        <div className="card">
          <p className="text-primary-400 text-xs uppercase tracking-wide mb-3">Overall Feedback</p>
          <p className="text-gray-300 text-sm leading-relaxed">{interview.aiFeedback}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {interview.strengths?.length > 0 && (
          <div className="card">
            <p className="text-emerald-400 text-xs uppercase tracking-wide mb-3">✅ Strengths</p>
            <ul className="space-y-1.5">{interview.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}</ul>
          </div>
        )}
        {interview.improvements?.length > 0 && (
          <div className="card">
            <p className="text-yellow-400 text-xs uppercase tracking-wide mb-3">💡 Areas to Improve</p>
            <ul className="space-y-1.5">{interview.improvements.map((s, i) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}</ul>
          </div>
        )}
      </div>

      <button onClick={() => setStage('setup')} className="btn-primary">Start Another Interview</button>
    </div>
  );

  return null;
}
