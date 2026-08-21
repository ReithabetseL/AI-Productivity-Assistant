import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function buildPrompt(feature: string, payload: Record<string, unknown>): string {
  switch (feature) {
    case "email": {
      const { tone, audience, purpose, context } = payload;
      return `You are a professional real estate email copywriter. Write a ${tone} email for a ${audience} with the purpose: "${purpose}".
${context ? `Additional context: ${context}` : ""}

Requirements:
- Include a professional subject line (prefix with "Subject: ")
- Keep it concise but persuasive (150–220 words body)
- Use appropriate real estate terminology
- End with a clear call-to-action
- Use a professional sign-off

Format: Subject line first, then blank line, then email body.`;
    }

    case "meeting": {
      const { rawNotes, meetingType, attendees } = payload;
      return `You are a professional meeting analyst for a real estate agency. Summarize the following raw notes from a "${meetingType}" meeting${attendees ? ` with attendees: ${attendees}` : ""}.

Raw Notes:
${rawNotes}

Create a structured summary with these sections:
1. **Meeting Overview** (1–2 sentences)
2. **Key Discussion Points** (bullet list, 3–6 points)
3. **Decisions Made** (bullet list)
4. **Action Items** (each with: task, owner if mentioned, deadline if mentioned)
5. **Next Steps** (brief)

Be concise and professional. Extract only what is explicitly mentioned in the notes.`;
    }

    case "tasks": {
      const { role, goals, constraints } = payload;
      return `You are a productivity coach for a real estate professional. Create a prioritized daily task plan for a ${role}.

Goals for today: ${goals}
${constraints ? `Constraints: ${constraints}` : ""}

Return ONLY a valid JSON array (no markdown, no explanation) with 5–8 tasks in this exact format:
[
  {
    "id": "1",
    "title": "Task title",
    "description": "Brief one-sentence description",
    "priority": "high|medium|low",
    "dueDate": "Today 9:00 AM",
    "category": "Client Relations|Admin|Prospecting|Listings|Finance",
    "completed": false
  }
]

Prioritize revenue-generating and time-sensitive tasks first. Make tasks specific and actionable.`;
    }

    case "research": {
      const { query, researchType, location } = payload;
      return `You are a real estate market analyst. Provide a comprehensive ${researchType} report${location ? ` for ${location}` : ""}.

Research question: ${query}

Structure your response with:
1. **Executive Summary** (2–3 sentences)
2. **Key Findings** (4–6 bullet points with data-driven insights)
3. **Market Trends** (relevant to the research type)
4. **Opportunities & Risks** (2–3 each)
5. **Recommendation** (1 clear actionable recommendation)

Use professional real estate language. Note if specific data would need verification from live market sources.`;
    }

    case "chat": {
      const { message, history } = payload as { message: string; history: Array<{ role: string; content: string }> };
      const historyText = Array.isArray(history) && history.length > 0
        ? history.map((m) => `${m.role === "user" ? "Human" : "Assistant"}: ${m.content}`).join("\n")
        : "";
      return `You are PropAI, an expert real estate assistant for a professional real estate agency. You have deep knowledge of:
- Real estate sales strategies and negotiation
- Market analysis and property valuation
- Client relationship management
- Real estate law and contracts (advisory only, not legal advice)
- Mortgage and financing
- Property management
- Marketing and lead generation

${historyText ? `Conversation so far:\n${historyText}\n\n` : ""}Human: ${message}

Respond helpfully, concisely, and professionally. For legal or financial matters, recommend consulting a licensed professional.`;
    }

    default:
      throw new Error(`Unknown feature: ${feature}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service is not configured. Please add an OPENAI_API_KEY secret." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { feature, ...payload } = body;

    if (!feature) {
      return new Response(
        JSON.stringify({ error: "Missing 'feature' field." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(feature, payload);

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? `OpenAI error (${openaiRes.status})`);
    }

    const data = await openaiRes.json();
    const result = data?.choices?.[0]?.message?.content;

    if (!result) throw new Error("No content returned from AI.");

    return new Response(
      JSON.stringify({ result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
