import { useState } from 'react';
import { Send, Copy, RefreshCw, Mail, CheckCircle } from 'lucide-react';
import { callAI } from '@/lib/supabase';
import AIDisclaimer from './AIDisclaimer';

const tones = ['Professional', 'Friendly', 'Urgent', 'Persuasive', 'Formal', 'Empathetic'];
const audiences = [
  'First-time Buyer',
  'Luxury Client',
  'Property Investor',
  'Seller',
  'Fellow Agent',
  'Property Manager',
];
const purposes = [
  'Property Inquiry Follow-up',
  'Open House Invitation',
  'Price Reduction Announcement',
  'Offer Presentation',
  'Closing Congratulations',
  'Market Update',
  'Referral Thank-you',
  'Listing Feedback Request',
];

export default function EmailGenerator() {
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('First-time Buyer');
  const [purpose, setPurpose] = useState('Property Inquiry Follow-up');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const result = await callAI('email', { tone, audience, purpose, context });
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
        {/* Config Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            Email Configuration
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Email Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {purposes.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Target Audience</label>
            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    audience === a
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Writing Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    tone === t
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Additional Context <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Property at 428 Maple Ave, $650K asking price, client viewed last Tuesday..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating email...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Email
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Generated Email</h3>
            {output && (
              <button
                onClick={copyOutput}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                {copied ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
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
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Crafting your email...</p>
            </div>
          ) : output ? (
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-mono overflow-auto">
              {output}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <Mail className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Configure your email above and click Generate</p>
            </div>
          )}

          {output && <AIDisclaimer />}
        </div>
      </div>
    </div>
  );
}
