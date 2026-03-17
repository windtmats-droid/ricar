import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if this is a recovery callback
  const hash = window.location.hash;
  const isRecovery = hash.includes("type=recovery");

  const [newPassword, setNewPassword] = useState("");
  const [updated, setUpdated] = useState(false);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      setError(err.message);
    } else {
      setUpdated(true);
    }
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
          <p className="text-[13px] text-muted-foreground mt-1">
            {isRecovery ? "Neues Passwort setzen" : "Passwort zurücksetzen"}
          </p>
        </div>

        {isRecovery ? (
          updated ? (
            <div className="text-center space-y-3">
              <p className="text-[13px] text-foreground">Passwort erfolgreich geändert!</p>
              <Link to="/login" className="text-[13px] text-primary hover:underline font-medium">Zum Login</Link>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-[12px] text-muted-foreground mb-1.5 block">Neues Passwort</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-[38px] text-[13px]" required />
              </div>
              {error && <p className="text-[12px] text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-10 text-[13px]" disabled={loading}>Passwort ändern</Button>
            </form>
          )
        ) : sent ? (
          <div className="text-center space-y-3">
            <p className="text-[13px] text-foreground">E-Mail zum Zurücksetzen wurde gesendet.</p>
            <p className="text-[12px] text-muted-foreground">Prüfe dein Postfach und klicke auf den Link.</p>
            <Link to="/login" className="text-[13px] text-primary hover:underline font-medium">Zurück zum Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSendReset} className="space-y-4">
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">E-Mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-[38px] text-[13px]" required />
            </div>
            {error && <p className="text-[12px] text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-10 text-[13px]" disabled={loading}>Link senden</Button>
            <p className="text-center text-[13px] text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Zurück zum Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
