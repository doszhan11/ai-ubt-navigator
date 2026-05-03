import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "student" | "teacher" | "admin";

interface AppProfile {
  id: string;
  full_name: string | null;
  language: string;
  avatar_url: string | null;
}

interface StudentProfile {
  subject_pair_id: number | null;
  subscription_tier: "free" | "premium";
  onboarded: boolean;
  score_qazaqstan_tarihy: number;
  score_oku_saattylyghy: number;
  score_math_saattylyghy: number;
  score_subject_1: number;
  score_subject_2: number;
}

interface AuthState {
  loading: boolean;
  user: User | null;
  session: Session | null;
  profile: AppProfile | null;
  studentProfile: StudentProfile | null;
  role: Role | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExtras = async (uid: string) => {
    const [{ data: prof }, { data: sp }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id,full_name,language,avatar_url").eq("id", uid).maybeSingle(),
      supabase.from("student_profiles").select("subject_pair_id,subscription_tier,onboarded,score_qazaqstan_tarihy,score_oku_saattylyghy,score_math_saattylyghy,score_subject_1,score_subject_2").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile(prof as AppProfile | null);
    setStudentProfile(sp as StudentProfile | null);
    const roleList = (roles ?? []).map((r: any) => r.role) as Role[];
    const r: Role | null = roleList.includes("admin") ? "admin" : roleList.includes("teacher") ? "teacher" : roleList.includes("student") ? "student" : null;
    setRole(r);
  };

  const refresh = async () => {
    if (user) await fetchExtras(user.id);
  };

  useEffect(() => {
    // Set up listener BEFORE getSession (Supabase auth pattern)
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer to avoid deadlock
        setTimeout(() => { void fetchExtras(sess.user.id); }, 0);
      } else {
        setProfile(null); setStudentProfile(null); setRole(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        void fetchExtras(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null); setStudentProfile(null); setRole(null);
  };

  return (
    <AuthContext.Provider value={{ loading, user, session, profile, studentProfile, role, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
