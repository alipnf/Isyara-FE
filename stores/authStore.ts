import { create } from 'zustand';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  user: null,
  session: null,
  loading: true,
  initialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  signUp: async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return { error };
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirect to dedicated callback route for instant client-side redirect
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  },

  initialize: async () => {
    if (get().initialized) return;

    try {
      set({ loading: true });

      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes
      const {
        data: {},
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
        });
      });

      // Store subscription for cleanup (you might want to handle this differently)
      // For now, we'll let it run for the app lifetime
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },
}));
