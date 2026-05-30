import { Link } from 'react-router-dom';

const features = [
  { icon: '📄', title: 'AI Resume Analyzer', desc: 'Get ATS score, keyword suggestions, and instant AI-powered feedback on your resume.' },
  { icon: '🎤', title: 'AI Mock Interviews', desc: 'Practice with AI-generated questions. Get scored on technical, communication & confidence.' },
  { icon: '💻', title: 'Coding Practice', desc: 'Solve DSA problems with an online editor. Get AI feedback on time & space complexity.' },
  { icon: '🧠', title: 'Aptitude Tests', desc: 'Timed quizzes on quantitative, logical & verbal. AI identifies your weak areas.' },
  { icon: '🏢', title: 'Company Prep', desc: 'Company-specific hiring processes, previous questions, roadmaps for TCS, Amazon & more.' },
  { icon: '🚀', title: 'AI Career Advisor', desc: 'Enter your skills and get personalized career path recommendations with learning roadmaps.' },
  { icon: '💼', title: 'Job Recommendations', desc: 'Browse internships & jobs with AI match scores based on your profile.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track your progress across all modules with detailed charts and insights.' },
];

const companies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Amazon', 'Google', 'Microsoft', 'Flipkart', 'Deloitte', 'Cognizant'];

const stats = [
  { value: '10,000+', label: 'Students Placed' },
  { value: '95%', label: 'Success Rate' },
  { value: '500+', label: 'Companies' },
  { value: '50,000+', label: 'Practice Questions' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center font-bold text-lg">P</div>
            <span className="text-white font-bold font-display text-xl">PlacementAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started Free →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 text-primary-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            AI-Powered Placement Preparation Platform
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Land Your Dream
            <span className="block gradient-text">Tech Job</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The complete AI-powered platform to prepare for campus placements. Resume analysis, mock interviews, coding practice, and personalized career guidance — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">
              Start For Free →
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              Login
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required • Free forever for students</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold font-display gradient-text">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold mb-4">Everything You Need to Get Placed</h2>
            <p className="text-gray-400 text-lg">8 powerful AI-driven modules to take you from preparation to placement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className="card-hover group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="py-14 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Prepare for top companies</p>
          <div className="flex flex-wrap justify-center gap-4">
            {companies.map(c => (
              <span key={c} className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-gray-300 text-sm font-medium hover:border-primary-500/30 hover:text-primary-400 transition-all cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Ace Your Placement?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of students who landed their dream jobs using PlacementAI.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 mx-auto justify-center">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center text-gray-500 text-sm">
        <p>© 2025 PlacementAI. Built with ❤️ for engineering students.</p>
      </footer>
    </div>
  );
}
