import { useState } from 'react';
import { CheckSquare, RefreshCw, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';
import { callAI } from '@/lib/supabase';
import AIDisclaimer from './AIDisclaimer';
import type { Task, TaskPriority } from '@/types';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const roles = ['Listing Agent', 'Buyer Agent', 'Team Lead', 'Property Manager', 'Admin'];

export default function TaskPlanner() {
  const [role, setRole] = useState('Listing Agent');
  const [goals, setGoals] = useState('');
  const [constraints, setConstraints] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generatePlan() {
    if (!goals.trim()) return;
    setLoading(true);
    setError('');
    setTasks([]);
    try {
      const result = await callAI('tasks', { role, goals, constraints });
      const parsed: Task[] = JSON.parse(result);
      setTasks(parsed);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const incomplete = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-500" />
            Plan Your Day
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Your Role</label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    role === r ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600 hover:border-amber-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Today's Goals & Priorities</label>
            <textarea
              rows={4}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. Follow up with 3 leads from open house, prepare CMA for Smith property, review two offers..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none placeholder-gray-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Constraints <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. Out from 2–4pm, max 8 tasks, focus on revenue activities"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
            />
          </div>

          <button
            onClick={generatePlan}
            disabled={loading || !goals.trim()}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Planning...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Plan</>
            )}
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Today's Task Plan</h3>
            {tasks.length > 0 && (
              <span className="text-xs text-gray-500">{incomplete} remaining</span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Building your optimal plan...</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="flex-1 space-y-3 overflow-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-3.5 transition-opacity ${task.completed ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      {task.completed && <Plus className="w-3 h-3 rotate-45" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                          </span>
                        )}
                        {task.category && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <AIDisclaimer />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <CheckSquare className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Enter your goals and generate a prioritized plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
