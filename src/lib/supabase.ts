import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function callAI(feature: string, payload: Record<string, unknown>): Promise<string> {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/ai-assistant`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feature, ...payload }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? `Request failed (${response.status})`);
  }

  const data = await response.json();
  if (!data.result) throw new Error('Unexpected response from AI service');
  return data.result;
}
