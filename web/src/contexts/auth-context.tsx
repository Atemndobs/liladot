import { AuthError, Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null };
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null };
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const getUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUserSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const response = {
        data: {
          user: data?.user ?? null,
          session: data?.session ?? null,
        },
        user: data?.user ?? null,
        session: data?.session ?? null,
        error: error,
      };

      if (error) {
        return response;
      }

      setUser(data?.user ?? null);
      setSession(data?.session ?? null);

      return response;
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        data: { user: null, session: null },
        user: null,
        session: null,
        error: error as AuthError,
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      const response = {
        data: {
          user: data?.user ?? null,
          session: data?.session ?? null,
        },
        user: data?.user ?? null,
        session: data?.session ?? null,
        error: error,
      };

      if (error) {
        return response;
      }

      setUser(data?.user ?? null);
      setSession(data?.session ?? null);

      return response;
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        data: { user: null, session: null },
        user: null,
        session: null,
        error: error as AuthError,
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error: error instanceof Error ? error : new Error('Failed to sign out') };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error instanceof Error ? error : new Error('Failed to reset password') };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
