import { AlertCircle } from 'lucide-react';

export default function AIDisclaimer() {
  return (
    <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
      <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700">
        AI-generated content may require human review before use.
      </p>
    </div>
  );
}
