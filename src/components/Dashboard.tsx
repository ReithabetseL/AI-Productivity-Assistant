import {
  Mail,
  ClipboardList,
  CheckSquare,
  Search,
  MessageSquare,
  TrendingUp,
  Users,
  Home,
  DollarSign,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const stats = [
  { label: 'Active Listings', value: '48', change: '+3 this week', Icon: Home, color: 'blue' },
  { label: 'Leads Pipeline', value: '124', change: '+12 this month', Icon: Users, color: 'emerald' },
  { label: 'Revenue MTD', value: '$342K', change: '+18% vs last', Icon: DollarSign, color: 'violet' },
  { label: 'Conversion Rate', value: '24%', change: '+2.1% trend', Icon: TrendingUp, color: 'amber' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
};

const tools = [
  {
    id: 'email',
    label: 'Email Generator',
    description: 'Draft client emails in seconds — tailored by tone and audience.',
    Icon: Mail,
    accent: 'border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-50 text-blue-600',
    badge: 'Most Used',
  },
  {
    id: 'meeting',
    label: 'Meeting Notes',
    description: 'Paste raw notes and get a clean summary with action items.',
    Icon: ClipboardList,
    accent: 'border-emerald-200 hover:border-emerald-400',
    iconBg: 'bg-emerald-50 text-emerald-600',
    badge: null,
  },
  {
    id: 'tasks',
    label: 'Task Planner',
    description: 'AI-prioritized schedule so nothing falls through the cracks.',
    Icon: CheckSquare,
    accent: 'border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-50 text-amber-600',
    badge: 'New',
  },
  {
    id: 'research',
    label: 'Research Assistant',
    description: 'Instant market insights, property comparables, and summaries.',
    Icon: Search,
    accent: 'border-rose-200 hover:border-rose-400',
    iconBg: 'bg-rose-50 text-rose-600',
    badge: null,
  },
  {
    id: 'chatbot',
    label: 'AI Assistant',
    description: 'Ask anything about real estate, clients, or your daily tasks.',
    Icon: MessageSquare,
    accent: 'border-slate-200 hover:border-slate-400',
    iconBg: 'bg-slate-100 text-slate-600',
    badge: null,
  },
];

const activity = [
  { text: 'Email drafted for 428 Maple Ave buyer', time: '2m ago', dot: 'bg-blue-400' },
  { text: 'Meeting summary saved — Q3 Review', time: '14m ago', dot: 'bg-emerald-400' },
  { text: '5 tasks planned for today', time: '1h ago', dot: 'bg-amber-400' },
  { text: 'Market report generated for Lakeview', time: '3h ago', dot: 'bg-rose-400' },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, change, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {change}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">AI Tools</h2>
          <span className="text-xs text-gray-500">Click to open</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map(({ id, label, description, Icon, accent, iconBg, badge }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`bg-white rounded-xl border-2 p-5 text-left transition-all duration-200 shadow-sm hover:shadow-md group ${accent}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900">{label}</p>
                    {badge && (
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                <Zap className="w-3 h-3" />
                Launch tool
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-gray-50">
          {activity.map((item, i) => (
            <li key={i} className="px-6 py-3.5 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
              <p className="text-sm text-gray-700 flex-1">{item.text}</p>
              <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
