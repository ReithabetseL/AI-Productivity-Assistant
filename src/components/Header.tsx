import { Bell, User, Sparkles } from 'lucide-react';

const viewTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your daily productivity overview' },
  email: { title: 'Smart Email Generator', subtitle: 'Craft professional emails tailored to your audience' },
  meeting: { title: 'Meeting Notes Summarizer', subtitle: 'Transform raw notes into actionable summaries' },
  tasks: { title: 'AI Task Planner', subtitle: 'Prioritize and schedule your work intelligently' },
  research: { title: 'Research Assistant', subtitle: 'Gather market insights and property intelligence' },
  chatbot: { title: 'AI Assistant', subtitle: 'Your real estate AI powered by advanced intelligence' },
};

interface HeaderProps {
  activeView: string;
}

export default function Header({ activeView }: HeaderProps) {
  const { title, subtitle } = viewTitles[activeView] ?? viewTitles.dashboard;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h1>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          AI Powered
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
