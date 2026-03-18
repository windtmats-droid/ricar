const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const WEBHOOK_URL = "http://91.99.97.102:5679/beschreibung";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Forwarding to webhook:", JSON.stringify(body));

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await res.text();
    console.log("Webhook response status:", res.status);
    console.log("Webhook response body:", raw);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Webhook error", status: res.status }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse Claude API response and extract the text from content[0].text
    let beschreibung = "";
    try {
      const parsed = JSON.parse(raw);
      console.log("Parsed keys:", Object.keys(parsed));
      
      // Claude API format: { content: [{ type: "text", text: "..." }] }
      if (parsed?.content && Array.isArray(parsed.content) && parsed.content.length > 0) {
        beschreibung = parsed.content[0].text || "";
      } else if (typeof parsed === "string") {
        beschreibung = parsed;
      } else if (parsed?.beschreibung) {
        beschreibung = parsed.beschreibung;
      }
      
      // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
      if (beschreibung.startsWith("```")) {
        beschreibung = beschreibung.replace(/^```(?:json|text)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();
      }
    } catch {
      // If it's not JSON, use raw text directly
      beschreibung = raw;
    }

    console.log("Extracted beschreibung:", beschreibung.substring(0, 100));

    return new Response(JSON.stringify({ beschreibung }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
