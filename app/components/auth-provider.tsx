"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { isAdmin, isNorthwestern } from "@/lib/auth";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isAdminUser: boolean;
  loading: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  session: null,
  isAdminUser: false,
  loading: true,
  authError: null,
  signOut: async () => {},
});

const NON_NORTHWESTERN_ERROR =
  "Only Northwestern University (@u.northwestern.edu) accounts are allowed.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function applySession(session: Session | null) {
      // Defense-in-depth: the Auth Hook blocks non-northwestern signups at
      // creation time, but can't retroactively block an account that
      // already existed before the hook was enabled.
      if (session?.user && !isNorthwestern(session.user.email)) {
        await supabase.auth.signOut();
        setAuthError(NON_NORTHWESTERN_ERROR);
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdminUser: isAdmin(user?.email),
        loading,
        authError,
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
