const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const WEBHOOK_URL = "http://91.99.97.102:5678/webhook/8246694b-0a6b-471f-8861-d616f419509e";

const FALLBACK = { bewertung: "Mittel", begruendung: "KI-Bewertung konnte nicht durchgeführt werden.", antwort: "" };

function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Forwarding to evaluate webhook:", JSON.stringify(body));

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await res.text();
    console.log("Webhook status:", res.status, "body:", raw);

    if (!res.ok) {
      console.error("Webhook returned error, using fallback");
      return new Response(JSON.stringify(FALLBACK), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the webhook response
    let webhookData;
    try { webhookData = JSON.parse(raw); } catch {
      console.error("Failed to parse webhook response as JSON");
      return new Response(JSON.stringify(FALLBACK), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract content[0].text
    const contentText = webhookData?.content?.[0]?.text;
    if (!contentText) {
      // Maybe it's already a direct object with bewertung
      if (webhookData?.bewertung) {
        return new Response(JSON.stringify({
          bewertung: webhookData.bewertung,
          begruendung: webhookData.begruendung || "",
          antwort: webhookData.antwort || "",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      console.error("No content[0].text found, using fallback");
      return new Response(JSON.stringify(FALLBACK), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strip markdown code fences and parse
    const cleaned = stripCodeFences(contentText);
    let parsed;
    try { parsed = JSON.parse(cleaned); } catch {
      console.error("Failed to parse content text as JSON:", cleaned);
      return new Response(JSON.stringify(FALLBACK), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = {
      bewertung: parsed.bewertung || "Mittel",
      begruendung: parsed.begruendung || "",
      antwort: parsed.antwort || "",
    };

    console.log("Returning evaluation:", JSON.stringify(result));
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(JSON.stringify(FALLBACK), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
