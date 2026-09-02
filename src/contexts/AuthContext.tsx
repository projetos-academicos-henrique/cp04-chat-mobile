import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, syncUserProfile } from '../services/userService';
import {
  registerWithEmail as authRegister,
  loginWithEmail as authLogin,
  signInWithGoogle as authGoogle,
  signInWithApple as authApple,
  logout as authLogout,
  getFriendlyAuthErrorMessage,
} from '../services/authService';
import type { ChatUser, AuthProvider as AuthProviderType } from '../types/user';

export interface AuthContextData {
  currentUser: ChatUser | null;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (options?: { idToken?: string; name?: string; email?: string }) => Promise<void>;
  loginWithApple: (options?: { identityToken?: string; nonce?: string; name?: string; email?: string }) => Promise<void>;
  logoutUser: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Ouve mudanças de estado do Firebase Auth em tempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (firebaseUser) {
          // Identifica o provedor a partir dos dados retornados pelo Firebase Auth
          let detectedProvider: AuthProviderType = 'password';
          const providerId = firebaseUser.providerData?.[0]?.providerId;
          if (providerId === 'google.com') {
            detectedProvider = 'google';
          } else if (providerId === 'apple.com') {
            detectedProvider = 'apple';
          }

          const profile = await getUserProfile(firebaseUser.uid, 2000);
          if (profile) {
            setCurrentUser(profile);
          } else {
            const fallbackUser: ChatUser = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || (detectedProvider === 'google' ? 'Usuário Google' : 'Usuário'),
              email: firebaseUser.email,
              provider: detectedProvider,
            };
            syncUserProfile(fallbackUser).catch(() => {});
            setCurrentUser(fallbackUser);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Erro ao sincronizar perfil do usuário:', err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = useCallback(async (name: string, email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authRegister(name, email, pass);
      setCurrentUser(user);
    } catch (err) {
      const message = getFriendlyAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authLogin(email, pass);
      setCurrentUser(user);
    } catch (err) {
      const message = getFriendlyAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(
    async (options?: { idToken?: string; name?: string; email?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const user = await authGoogle(options);
        setCurrentUser(user);
      } catch (err) {
        const message = getFriendlyAuthErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loginWithApple = useCallback(
    async (options?: { identityToken?: string; nonce?: string; name?: string; email?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const user = await authApple(options);
        setCurrentUser(user);
      } catch (err) {
        const message = getFriendlyAuthErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logoutUser = useCallback(async () => {
    setLoading(true);
    try {
      await authLogout();
      setCurrentUser(null);
    } catch (err) {
      const message = getFriendlyAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo<AuthContextData>(
    () => ({
      currentUser,
      loading,
      error,
      register,
      login,
      loginWithGoogle,
      loginWithApple,
      logoutUser,
      clearError,
    }),
    [currentUser, loading, error, register, login, loginWithGoogle, loginWithApple, logoutUser, clearError]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
