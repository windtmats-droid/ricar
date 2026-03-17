import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string | null;
  vorname: string | null;
  nachname: string | null;
  autohaus_name: string | null;
  rolle: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, profile: null, loading: true, signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const PUBLIC_ROUTES = ["/login", "/register", "/reset-password", "/"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data as Profile);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);

      if (sess?.user) {
        // Use setTimeout to avoid Supabase deadlock
        setTimeout(() => fetchProfile(sess.user.id), 0);
      } else {
        setProfile(null);
      }

      if (event === "SIGNED_OUT") {
        navigate("/login");
      }

      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        fetchProfile(sess.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Route protection — temporarily disabled for development
  // useEffect(() => {
  //   if (loading) return;
  //   const isPublic = PUBLIC_ROUTES.some((r) => location.pathname === r);
  //   if (!user && !isPublic) {
  //     navigate("/login");
  //   }
  // }, [user, loading, location.pathname, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
