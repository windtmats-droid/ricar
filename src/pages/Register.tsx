import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", autohausName: "",
    password: "", passwordConfirm: "", rolle: "verkäufer",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    if (form.password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          vorname: form.vorname,
          nachname: form.nachname,
          autohaus_name: form.autohausName,
          rolle: form.rolle,
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Diese E-Mail ist bereits registriert");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-card border border-border rounded-[14px] p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-[18px] font-medium text-foreground">AutoDealer KI</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Konto erstellen</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">Vorname</label>
              <Input value={form.vorname} onChange={(e) => update("vorname", e.target.value)} className="h-[38px] text-[13px]" required />
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">Nachname</label>
              <Input value={form.nachname} onChange={(e) => update("nachname", e.target.value)} className="h-[38px] text-[13px]" required />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">E-Mail</label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="h-[38px] text-[13px]" required />
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">Autohaus Name</label>
            <Input value={form.autohausName} onChange={(e) => update("autohausName", e.target.value)} className="h-[38px] text-[13px]" required />
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">Passwort</label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} className="h-[38px] text-[13px] pr-9" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">Passwort wiederholen</label>
            <Input type="password" value={form.passwordConfirm} onChange={(e) => update("passwordConfirm", e.target.value)} className="h-[38px] text-[13px]" required />
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground mb-1.5 block">Rolle</label>
            <Select value={form.rolle} onValueChange={(v) => update("rolle", v)}>
              <SelectTrigger className="h-[38px] text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="verkäufer">Verkäufer</SelectItem>
                <SelectItem value="chef">Chef / Inhaber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-[12px] text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-10 text-[13px]" disabled={loading}>
            {loading ? "Wird erstellt..." : "Konto erstellen"}
          </Button>
        </form>

        <p className="text-center text-[13px] text-muted-foreground mt-5">
          Bereits ein Konto?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Anmelden</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
