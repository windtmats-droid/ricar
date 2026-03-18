import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("market-scan request body:", JSON.stringify(body));

    const response = await fetch("http://91.99.97.102:5679/marktscan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await response.text();
    console.log("market-scan raw response (first 500 chars):", raw.substring(0, 500));

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { raw };
    }

    // If the response has Claude's content[0].text structure, extract it
    if (parsed?.content?.[0]?.text) {
      let innerText = parsed.content[0].text;
      // Strip markdown code fences if present
      if (innerText.startsWith("```")) {
        innerText = innerText
          .replace(/^```(?:json|text)?\s*\n?/, "")
          .replace(/\n?```\s*$/, "")
          .trim();
      }
      try {
        parsed = JSON.parse(innerText);
      } catch {
        parsed = { raw: innerText };
      }
    }

    console.log("market-scan parsed keys:", Object.keys(parsed));

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("market-scan error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
