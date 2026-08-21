import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import EmailGenerator from '@/components/EmailGenerator';
import MeetingNotes from '@/components/MeetingNotes';
import TaskPlanner from '@/components/TaskPlanner';
import ResearchAssistant from '@/components/ResearchAssistant';
import Chatbot from '@/components/Chatbot';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function renderView() {
    switch (activeView) {
      case 'email': return <EmailGenerator />;
      case 'meeting': return <MeetingNotes />;
      case 'tasks': return <TaskPlanner />;
      case 'research': return <ResearchAssistant />;
      case 'chatbot': return <Chatbot />;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            setMobileSidebarOpen(false);
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header activeView={activeView} />
        <main className="flex-1 px-4 lg:px-8 py-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
