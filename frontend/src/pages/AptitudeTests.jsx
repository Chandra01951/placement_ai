import { useState } from 'react';
import API from '../utils/api';

const categories = [
  { id: 'quantitative', name: 'Quantitative Aptitude', icon: '📊', desc: 'Numbers, percentages, profit & loss, time & work', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
  { id: 'logical', name: 'Logical Reasoning', icon: '🧩', desc: 'Patterns, sequences, coding-decoding, puzzles', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
  { id: 'verbal', name: 'Verbal Ability', icon: '📝', desc: 'Grammar, vocabulary, reading comprehension', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20' },
];

// Fallback questions if API is unavailable
const sampleQuestions = {
  quantitative: [
    { _id: 'q1', description: 'A train travels 60 km in 1 hour. How long will it take to travel 240 km?', options: ['2 hours', '3 hours', '4 hours', '5 hours'], correctAnswer: '4 hours', explanation: 'Speed = 60 km/h. Time = Distance/Speed = 240/60 = 4 hours' },
    { _id: 'q2', description: 'If 20% of a number is 80, what is the number?', options: ['160', '200', '320', '400'], correctAnswer: '400', explanation: '20% of x = 80 → x = 80 × 100/20 = 400' },
    { _id: 'q3', description: 'A shopkeeper marks goods at 20% above cost and offers 10% discount. Find the profit %?', options: ['6%', '8%', '10%', '12%'], correctAnswer: '8%', explanation: 'If CP = 100, MP = 120, SP = 120 × 0.9 = 108. Profit = 8%' },
  ],
  logical: [
    { _id: 'l1', description: 'Find the missing number: 2, 4, 8, 16, __', options: ['24', '32', '36', '40'], correctAnswer: '32', explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32' },
    { _id: 'l2', description: 'If MANGO is coded as NBOAT, how is APPLE coded?', options: ['BQPNF', 'BQQMF', 'CRRNG', 'BQQLE'], correctAnswer: 'BQQMF', explanation: 'Each letter is shifted +1: A→B, P→Q, P→Q, L→M, E→F' },
  ],
  verbal: [
    { _id: 'v1', description: 'Choose the word most similar in meaning to ELOQUENT:', options: ['Silent', 'Articulate', 'Confused', 'Timid'], correctAnswer: 'Articulate', explanation: 'Eloquent means well-spoken or articulate.' },
    { _id: 'v2', description: 'Select the correct sentence:', options: ['He don\'t know the answer', 'He doesn\'t knows the answer', 'He doesn\'t know the answer', 'He not know the answer'], correctAnswer: 'He doesn\'t know the answer', explanation: 'With he/she/it, we use "doesn\'t" + base verb.' },
  ],
};

export default function AptitudeTests() {
  const [stage, setStage] = useState('categories'); // categories | quiz | results
  const [selectedCat, setSelectedCat] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timer, setTimer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = async (cat) => {
    setLoading(true);
    setSelectedCat(cat);
    try {
      const { data } = await API.get(`/aptitude/questions?category=${cat.id}&limit=5`);
      const qs = data.questions.length >= 2 ? data.questions : sampleQuestions[cat.id] || sampleQuestions.quantitative;
      setQuestions(qs);
    } catch {
      setQuestions(sampleQuestions[cat.id] || sampleQuestions.quantitative);
    }
    setCurrentQ(0);
    setUserAnswers([]);
    setSelected(null);
    setTimeLeft(30);
    setStage('quiz');
    setLoading(false);
  };

  const handleAnswer = async (answer) => {
    if (selected) return;
    setSelected(answer);
    const q = questions[currentQ];
    const isCorrect = answer === q.correctAnswer;
    const newAnswers = [...userAnswers, { questionId: q._id, selectedAnswer: answer, isCorrect, category: selectedCat?.id }];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(p => p + 1);
        setSelected(null);
        setTimeLeft(30);
      } else {
        finishQuiz(newAnswers);
      }
    }, 1200);
  };

  const finishQuiz = async (answers) => {
    const correct = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correct / answers.length) * 100);
    let aiAnalysis = { weakAreas: [], strongAreas: [], suggestions: ['Keep practicing!'] };

    try {
      const { data } = await API.post('/aptitude/submit', {
        answers, category: selectedCat?.id, timeTaken: answers.length * 30,
      });
      aiAnalysis = data.result?.aiAnalysis || aiAnalysis;
    } catch { }

    setResult({ correct, total: answers.length, score, aiAnalysis, answers });
    setStage('results');
  };

  const q = questions[currentQ];
  const optionStyle = (opt) => {
    if (!selected) return 'bg-white/[0.03] border-white/[0.06] text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.12]';
    if (opt === q?.correctAnswer) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
    if (opt === selected && opt !== q?.correctAnswer) return 'bg-red-500/20 border-red-500/40 text-red-300';
    return 'bg-white/[0.03] border-white/[0.06] text-gray-500';
  };

  if (stage === 'categories') return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-heading">🧠 Aptitude Tests</h1>
        <p className="text-gray-400 text-sm mt-1">Timed quizzes to sharpen your aptitude skills with AI weak-area analysis.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => startQuiz(cat)} disabled={loading} className={`card-hover bg-gradient-to-br ${cat.color} text-left p-6 group`}>
            <div className="text-4xl mb-4">{cat.icon}</div>
            <h3 className="font-display font-bold text-white text-lg group-hover:text-primary-300 transition-colors">{cat.name}</h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{cat.desc}</p>
            <div className="mt-5 text-primary-400 text-sm font-medium">Start Test →</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (stage === 'quiz' && q) return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-white">{selectedCat?.name}</h2>
        <span className="badge-primary">Q {currentQ + 1}/{questions.length}</span>
      </div>
      <div className="progress-bar"><div className="progress-fill bg-primary-500" style={{ width: `${(currentQ / questions.length) * 100}%` }} /></div>

      <div className="card">
        <p className="text-white text-lg font-medium leading-relaxed mb-6">{q.description}</p>
        <div className="space-y-3">
          {q.options?.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)} className={`w-full text-left p-4 rounded-xl border transition-all ${optionStyle(opt)}`}>
              <span className="inline-flex w-7 h-7 rounded-full bg-white/[0.05] items-center justify-center text-sm font-bold mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
        {selected && q.explanation && (
          <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <p className="text-primary-400 text-xs font-medium mb-1">Explanation</p>
            <p className="text-gray-300 text-sm">{q.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (stage === 'results' && result) return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="card text-center py-8">
        <div className="text-5xl mb-4">{result.score >= 70 ? '🎉' : result.score >= 40 ? '📈' : '💪'}</div>
        <h1 className="font-display text-3xl font-bold text-white">{result.score}%</h1>
        <p className="text-gray-400 mt-2">{result.correct} / {result.total} correct answers</p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="text-emerald-400 text-2xl font-bold">{result.correct}</p>
            <p className="text-gray-400 text-xs">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-red-400 text-2xl font-bold">{result.total - result.correct}</p>
            <p className="text-gray-400 text-xs">Wrong</p>
          </div>
        </div>
      </div>

      {result.aiAnalysis?.suggestions?.length > 0 && (
        <div className="card">
          <p className="text-primary-400 text-xs uppercase tracking-wide mb-3">🤖 AI Suggestions</p>
          <ul className="space-y-2">{result.aiAnalysis.suggestions.map((s, i) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}</ul>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => startQuiz(selectedCat)} className="btn-primary flex-1 justify-center">Try Again</button>
        <button onClick={() => setStage('categories')} className="btn-secondary flex-1 justify-center">Other Categories</button>
      </div>
    </div>
  );

  return null;
}
