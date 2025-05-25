import { supabase } from './client';
import { SupabaseErrorHandler, type SupabaseError } from './errorHandler';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences?: Record<string, any>;
}

export interface AuthResponse {
  user: UserProfile | null;
  session: any | null;
  error: SupabaseError | null;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Sign up a new user with email and password
   */
  public async signUp(
    email: string,
    password: string,
    userData: Partial<UserProfile> = {}
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || '',
            avatar_url: userData.avatar_url || '',
          },
        },
      });

      if (error) {
        const errorObj = SupabaseErrorHandler.parseError(error);
        return { user: null, session: null, error: errorObj };
      }

      if (data?.user) {
        // Create user profile in the database
        const profile = await this.createUserProfile(data.user.id, {
          email: data.user.email || '',
          ...userData,
        });

        return {
          user: profile,
          session: data.session,
          error: null,
        };
      }

      return {
        user: null,
        session: null,
        error: {
          code: 'signup_failed',
          message: 'Failed to create user account',
        },
      };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { user: null, session: null, error: errorObj };
    }
  }

  /**
   * Sign in with email and password
   */
  public async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const errorObj = SupabaseErrorHandler.parseError(error);
        return { user: null, session: null, error: errorObj };
      }

      if (data?.user) {
        const profile = await this.getUserProfile(data.user.id);
        return {
          user: profile,
          session: data.session,
          error: null,
        };
      }

      return {
        user: null,
        session: null,
        error: {
          code: 'signin_failed',
          message: 'Failed to sign in',
        },
      };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { user: null, session: null, error: errorObj };
    }
  }

  /**
   * Sign out the current user
   */
  public async signOut(): Promise<{ error: SupabaseError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        const errorObj = SupabaseErrorHandler.parseError(error);
        return { error: errorObj };
      }
      return { error: null };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { error: errorObj };
    }
  }

  /**
   * Get the current authenticated user
   */
  public async getCurrentUser(): Promise<{
    user: UserProfile | null;
    session: any | null;
    error: SupabaseError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        const errorObj = error
          ? SupabaseErrorHandler.parseError(error)
          : { code: 'not_authenticated', message: 'No active session' };
        return { user: null, session: null, error: errorObj };
      }

      const userId = data.session.user?.id;
      if (!userId) {
        return {
          user: null,
          session: null,
          error: { code: 'invalid_session', message: 'Invalid session data' },
        };
      }

      const profile = await this.getUserProfile(userId);
      return {
        user: profile,
        session: data.session,
        error: null,
      };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { user: null, session: null, error: errorObj };
    }
  }

  /**
   * Send password reset email
   */
  public async resetPassword(email: string): Promise<{ error: SupabaseError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const errorObj = SupabaseErrorHandler.parseError(error);
        return { error: errorObj };
      }

      return { error: null };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { error: errorObj };
    }
  }

  /**
   * Update user password
   */
  public async updatePassword(newPassword: string): Promise<{ error: SupabaseError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        const errorObj = SupabaseErrorHandler.parseError(error);
        return { error: errorObj };
      }

      return { error: null };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { error: errorObj };
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<{ user: UserProfile | null; error: SupabaseError | null }> {
    try {
      // Update auth user data if email is being updated
      if (updates.email) {
        const { error: updateError } = await supabase.auth.updateUser({
          email: updates.email,
        });

        if (updateError) {
          const errorObj = SupabaseErrorHandler.parseError(updateError);
          return { user: null, error: errorObj };
        }
      }

      // Update user profile in the database
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        const errorObj = SupabaseErrorHandler.parseError(error);
        return { user: null, error: errorObj };
      }

      return { user: data, error: null };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { user: null, error: errorObj };
    }
  }

  /**
   * Delete user account
   */
  public async deleteAccount(userId: string): Promise<{ error: SupabaseError | null }> {
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        const errorObj = SupabaseErrorHandler.parseError(profileError);
        return { error: errorObj };
      }

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) {
        const errorObj = SupabaseErrorHandler.parseError(authError);
        return { error: errorObj };
      }

      // Sign out
      await this.signOut();

      return { error: null };
    } catch (error) {
      const errorObj = SupabaseErrorHandler.parseError(error);
      return { error: errorObj };
    }
  }

  /**
   * Create or update user profile in the database
   */
  private async createUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      return null;
    }
  }

  /**
   * Get user profile from the database
   */
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

export const authService = AuthService.getInstance();

// Set up auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session);
  
  // Handle session refresh, sign in, sign out, etc.
  if (event === 'SIGNED_IN' && session?.user) {
    // Ensure user profile exists
    await authService.createUserProfile(session.user.id, {
      email: session.user.email || '',
      full_name: session.user.user_metadata?.full_name || '',
      avatar_url: session.user.user_metadata?.avatar_url || '',
    });
  }
});
