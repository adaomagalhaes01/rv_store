import { create } from 'zustand';
import { supabase, getProfile } from '../lib/supabase';

let initialized = false;
let authListener = null;

const useUserStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    if (initialized) return;
    initialized = true;

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await getProfile(session.user.id);
      set({
        isAuthenticated: true,
        user: { ...session.user, ...profile },
        profile,
        loading: false,
      });
    } else {
      set({ isAuthenticated: false, user: null, profile: null, loading: false });
    }

    if (!authListener) {
      authListener = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          getProfile(session.user.id).then((profile) =>
            set({ isAuthenticated: true, user: { ...session.user, ...profile }, profile })
          );
        } else if (event === 'SIGNED_OUT') {
          set({ isAuthenticated: false, user: null, profile: null });
        }
      });
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  register: async (email, password, fullName) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
  },

  sendPasswordReset: async (email) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?type=recovery`,
    });
  },

  updatePassword: async (password) => {
    return supabase.auth.updateUser({ password });
  },

  logout: async () => {
    await supabase.auth.signOut();
    if (authListener) {
      authListener.data?.subscription?.unsubscribe?.();
      authListener = null;
    }
    initialized = false;
    set({ isAuthenticated: false, user: null, profile: null });
  },
}));

export default useUserStore;