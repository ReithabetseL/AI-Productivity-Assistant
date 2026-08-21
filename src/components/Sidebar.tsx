import {
  LayoutDashboard,
  Mail,
  ClipboardList,
  CheckSquare,
  Search,
  MessageSquare,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'email', label: 'Email Generator', Icon: Mail },
  { id: 'meeting', label: 'Meeting Notes', Icon: ClipboardList },
  { id: 'tasks', label: 'Task Planner', Icon: CheckSquare },
  { id: 'research', label: 'Research Assistant', Icon: Search },
  { id: 'chatbot', label: 'AI Assistant', Icon: MessageSquare },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="px-6 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">PropAI Workspace</p>
            <p className="text-slate-400 text-xs">Real Estate Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider px-3 pb-2 pt-1">
          Tools
        </p>
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeView === id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700/60">
        <div className="bg-slate-800 rounded-lg px-3 py-2.5">
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-generated content may require human review before use.
          </p>
        </div>
      </div>
    </aside>
  );
}
