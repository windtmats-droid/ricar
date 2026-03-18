const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const WEBHOOK_URL = "http://91.99.97.102:5679/bewertung";

const FALLBACK = { bewertung: "Mittel", begruendung: "KI-Bewertung konnte nicht durchgeführt werden. Bitte prüfen Sie den KI-Service.", antwort: "" };

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

    let data;
    try { data = JSON.parse(raw); } catch {
      console.error("Failed to parse webhook response as JSON");
      return new Response(JSON.stringify(FALLBACK), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = {
      bewertung: data.bewertung || "Mittel",
      begruendung: data.begruendung || "",
      antwort: data.antwort || "",
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
