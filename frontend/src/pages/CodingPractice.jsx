import { useState, useEffect } from 'react';
import API from '../utils/api';

const categories = ['Arrays', 'Strings', 'LinkedList', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Binary Search'];
const languages = ['javascript', 'python', 'java', 'cpp'];

const starterCode = {
  javascript: `// Write your solution here
function solution(input) {
  // Your code
  return null;
}`,
  python: `# Write your solution here
def solution(input):
    # Your code
    return None`,
  java: `// Write your solution here
class Solution {
    public int[] solve(int[] nums) {
        // Your code
        return null;
    }
}`,
  cpp: `// Write your solution here
#include <vector>
using namespace std;

class Solution {
public:
    int solve(vector<int>& nums) {
        // Your code
        return 0;
    }
};`,
};

const sampleProblems = [
  { _id: '1', title: 'Two Sum', category: 'Arrays', difficulty: 'easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]', tags: ['hash-map', 'arrays'] },
  { _id: '2', title: 'Reverse Linked List', category: 'LinkedList', difficulty: 'easy', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]', tags: ['linked-list', 'recursion'] },
  { _id: '3', title: 'Maximum Subarray', category: 'Dynamic Programming', difficulty: 'medium', description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nExample:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6', tags: ['kadane', 'dp'] },
  { _id: '4', title: 'Binary Search', category: 'Binary Search', difficulty: 'easy', description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.\n\nIf target exists, then return its index. Otherwise, return -1.\n\nExample:\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4', tags: ['binary-search'] },
  { _id: '5', title: 'Longest Common Subsequence', category: 'Dynamic Programming', difficulty: 'hard', description: 'Given two strings text1 and text2, return the length of their longest common subsequence.\n\nExample:\nInput: text1 = "abcde", text2 = "ace"\nOutput: 3', tags: ['dp', 'strings'] },
];

export default function CodingPractice() {
  const [problems, setProblems] = useState(sampleProblems);
  const [selected, setSelected] = useState(sampleProblems[0]);
  const [code, setCode] = useState(starterCode.javascript);
  const [language, setLanguage] = useState('javascript');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activePanel, setActivePanel] = useState('problem');

  useEffect(() => {
    API.get('/coding/questions').then(r => {
      if (r.data.questions.length > 0) {
        setProblems(p => [...sampleProblems, ...r.data.questions]);
      }
    }).catch(() => {});
  }, []);

  const handleLanguageChange = lang => {
    setLanguage(lang);
    setCode(starterCode[lang]);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data } = await API.post('/coding/analyze', {
        code, language,
        questionTitle: selected.title,
        questionDescription: selected.description,
      });
      setAnalysis(data.analysis);
      setActivePanel('analysis');
    } catch (err) {
      alert(err.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const filtered = problems.filter(p =>
    (filterCategory === 'All' || p.category === filterCategory) &&
    (filterDiff === 'All' || p.difficulty === filterDiff)
  );

  const diffColor = d => d === 'easy' ? 'text-emerald-400' : d === 'medium' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="h-[calc(100vh-5.5rem)] flex gap-4 animate-fade-in">
      {/* Problem list */}
      <div className="w-72 shrink-0 flex flex-col gap-3">
        <div>
          <h1 className="font-display font-bold text-white text-lg">💻 Coding Practice</h1>
          <div className="flex gap-2 mt-3">
            <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="input-field text-sm py-1.5 flex-1">
              <option value="All">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {['All', ...categories.slice(0, 4)].map(c => (
              <button key={c} onClick={() => setFilterCategory(c)} className={`px-2 py-1 text-xs rounded-lg border transition-all ${filterCategory === c ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5">
          {filtered.map(p => (
            <button key={p._id} onClick={() => { setSelected(p); setAnalysis(null); setActivePanel('problem'); }} className={`w-full text-left p-3 rounded-xl border transition-all ${selected?._id === p._id ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'}`}>
              <p className="text-white text-sm font-medium truncate">{p.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                <span className="text-gray-500 text-xs">{p.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 gap-3">
        {/* Problem/Analysis tabs */}
        <div className="card flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-3">
              {['problem', 'analysis'].map(tab => (
                <button key={tab} onClick={() => setActivePanel(tab)} className={`text-sm font-medium px-3 py-1.5 rounded-lg capitalize transition-all ${activePanel === tab ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${diffColor(selected?.difficulty)}`}>{selected?.difficulty}</span>
              <span className="badge-primary text-xs">{selected?.category}</span>
            </div>
          </div>

          {activePanel === 'problem' ? (
            <div>
              <h2 className="font-display font-bold text-white text-lg mb-3">{selected?.title}</h2>
              <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-body">{selected?.description}</pre>
            </div>
          ) : (
            <div>
              {analysis ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Time Complexity', value: analysis.timeComplexity },
                      { label: 'Space Complexity', value: analysis.spaceComplexity },
                      { label: 'Code Score', value: `${analysis.score}/100` },
                    ].map(m => (
                      <div key={m.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                        <p className="text-primary-400 font-mono font-bold">{m.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm">{analysis.feedback}</p>
                  {analysis.optimizationSuggestions?.length > 0 && (
                    <div>
                      <p className="text-yellow-400 text-xs uppercase tracking-wide mb-2">Optimization Suggestions</p>
                      {analysis.optimizationSuggestions.map((s, i) => <p key={i} className="text-gray-300 text-sm">• {s}</p>)}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">Write your solution and click "Analyze Code" to get AI feedback.</p>
              )}
            </div>
          )}
        </div>

        {/* Code editor */}
        <div className="card flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex gap-1.5">
              {languages.map(l => (
                <button key={l} onClick={() => handleLanguageChange(l)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all font-mono ${language === l ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary text-sm py-1.5">
              {analyzing ? '🤖 Analyzing...' : '🤖 Analyze Code'}
            </button>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="code-area flex-1 resize-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
