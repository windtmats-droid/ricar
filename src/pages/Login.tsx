import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("E-Mail oder Passwort falsch");
      setLoading(false);
      return;
    }

    // Fetch role to determine redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("rolle")
      .eq("id", data.user.id)
      .single();

    if (profile?.rolle === "chef") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-card border border-border rounded-[14px] p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-[18px] font-medium text-foreground">AutoDealer KI</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Melde dich an, um fortzufahren</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">E-Mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[38px] text-[13px]"
              required
            />
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">Passwort</label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[38px] text-[13px] pr-9"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-[12px] text-muted-foreground cursor-pointer">
              <Checkbox checked={remember} onCheckedChange={(c) => setRemember(!!c)} />
              Angemeldet bleiben
            </label>
            <Link to="/reset-password" className="text-[12px] text-primary hover:underline">Passwort vergessen?</Link>
          </div>

          {error && <p className="text-[12px] text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-10 text-[13px]" disabled={loading}>
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[12px] text-muted-foreground">oder</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-[13px] text-muted-foreground">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">Registrieren</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
