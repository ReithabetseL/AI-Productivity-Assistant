import { useState } from 'react';
import { ClipboardList, RefreshCw, Copy, CheckCircle, FileText } from 'lucide-react';
import { callAI } from '@/lib/supabase';
import AIDisclaimer from './AIDisclaimer';

const meetingTypes = ['Team Stand-up', 'Client Consultation', 'Offer Review', 'Property Walkthrough', 'Investor Briefing', 'Strategy Session'];

export default function MeetingNotes() {
  const [rawNotes, setRawNotes] = useState('');
  const [meetingType, setMeetingType] = useState('Team Stand-up');
  const [attendees, setAttendees] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function summarize() {
    if (!rawNotes.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const result = await callAI('meeting', { rawNotes, meetingType, attendees });
      setOutput(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-500" />
            Meeting Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Meeting Type</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {meetingTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Attendees</label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="e.g. Sarah, Mark, Client"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Raw Notes</label>
            <textarea
              rows={10}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Paste your meeting notes here — bullet points, fragments, shorthand — whatever you captured during the meeting..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder-gray-400"
            />
          </div>

          <button
            onClick={summarize}
            disabled={loading || !rawNotes.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Summarizing...</>
            ) : (
              <><FileText className="w-4 h-4" /> Summarize Notes</>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Meeting Summary</h3>
            {output && (
              <button onClick={copyOutput} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
                {copied ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Processing your notes...</p>
            </div>
          ) : output ? (
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap overflow-auto">
              {output}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Paste your notes and click Summarize</p>
            </div>
          )}

          {output && <AIDisclaimer />}
        </div>
      </div>
    </div>
  );
}
