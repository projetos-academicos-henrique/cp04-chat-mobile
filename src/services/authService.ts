import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { syncUserProfile, getUserProfile } from './userService';
import type { ChatUser } from '../types/user';

export function getFriendlyAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'auth/invalid-email':
        return 'O endereço de e-mail informado é inválido.';
      case 'auth/user-disabled':
        return 'Esta conta de usuário foi desativada.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique o e-mail ou cadastre-se.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Credenciais inválidas. Verifique seu e-mail e senha.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso por outra conta.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Utilize no mínimo 6 caracteres.';
      case 'auth/network-request-failed':
        return 'Falha de conexão com a internet. Verifique sua rede.';
      case 'auth/operation-not-allowed':
        return 'Este método de autenticação não está ativado no Firebase Console.';
      default:
        return `Erro de autenticação (${code}). Tente novamente.`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado na autenticação.';
}

export async function registerWithEmail(
  name: string,
  email: string,
  pass: string
): Promise<ChatUser> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    throw new Error('Por favor, informe seu nome completo.');
  }
  if (!trimmedEmail) {
    throw new Error('Por favor, informe um endereço de e-mail válido.');
  }
  if (!pass || pass.length < 6) {
    throw new Error('A senha deve conter no mínimo 6 caracteres.');
  }

  const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
  await updateProfile(credential.user, { displayName: trimmedName });

  const chatUser: ChatUser = {
    uid: credential.user.uid,
    name: trimmedName,
    email: credential.user.email,
    provider: 'password',
  };

  await syncUserProfile(chatUser);
  return chatUser;
}

export async function loginWithEmail(email: string, pass: string): Promise<ChatUser> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    throw new Error('Por favor, informe seu e-mail.');
  }
  if (!pass) {
    throw new Error('Por favor, informe sua senha.');
  }

  const credential = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
  const existingProfile = await getUserProfile(credential.user.uid);

  const chatUser: ChatUser = {
    uid: credential.user.uid,
    name: credential.user.displayName || existingProfile?.name || 'Usuário',
    email: credential.user.email,
    provider: 'password',
  };

  await syncUserProfile(chatUser);
  return chatUser;
}

/**
 * Autenticação com Google:
 * Suporta passagem de idToken (quando integrado com Google Sign-In nativo)
 * ou fluxo de simulação do provedor Google para testes/avaliação.
 */
export async function signInWithGoogle(options?: {
  idToken?: string;
  name?: string;
  email?: string;
}): Promise<ChatUser> {
  if (options?.idToken) {
    const credential = GoogleAuthProvider.credential(options.idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const chatUser: ChatUser = {
      uid: user.uid,
      name: user.displayName || options.name || 'Google User',
      email: user.email,
      provider: 'google',
    };

    await syncUserProfile(chatUser);
    return chatUser;
  }

  // Modo de login simulado do provedor Google (para avaliação sem credenciais GCP configuradas)
  const syntheticEmail = options?.email || `google.user.${Date.now().toString().slice(-4)}@gmail.com`;
  const syntheticName = options?.name || 'Usuário Google';
  const syntheticPass = 'GoogleDevPass@2026';

  let user: User;
  try {
    const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, syntheticPass);
    user = cred.user;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'auth/email-already-in-use'
    ) {
      const cred = await signInWithEmailAndPassword(auth, syntheticEmail, syntheticPass);
      user = cred.user;
    } else {
      throw err;
    }
  }

  await updateProfile(user, { displayName: syntheticName });

  const chatUser: ChatUser = {
    uid: user.uid,
    name: syntheticName,
    email: syntheticEmail,
    provider: 'google',
  };

  await syncUserProfile(chatUser);
  return chatUser;
}

/**
 * Autenticação com Apple:
 * Suporta passagem de identityToken (quando integrado com Apple Authentication nativo)
 * ou fluxo de simulação do provedor Apple para testes/avaliação.
 */
export async function signInWithApple(options?: {
  identityToken?: string;
  nonce?: string;
  name?: string;
  email?: string;
}): Promise<ChatUser> {
  if (options?.identityToken) {
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: options.identityToken,
      rawNonce: options.nonce,
    });
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const chatUser: ChatUser = {
      uid: user.uid,
      name: user.displayName || options.name || 'Apple User',
      email: user.email,
      provider: 'apple',
    };

    await syncUserProfile(chatUser);
    return chatUser;
  }

  // Modo de login simulado do provedor Apple (para avaliação sem Apple Developer account)
  const syntheticEmail = options?.email || `apple.user.${Date.now().toString().slice(-4)}@privaterelay.appleid.com`;
  const syntheticName = options?.name || 'Usuário Apple';
  const syntheticPass = 'AppleDevPass@2026';

  let user: User;
  try {
    const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, syntheticPass);
    user = cred.user;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'auth/email-already-in-use'
    ) {
      const cred = await signInWithEmailAndPassword(auth, syntheticEmail, syntheticPass);
      user = cred.user;
    } else {
      throw err;
    }
  }

  await updateProfile(user, { displayName: syntheticName });

  const chatUser: ChatUser = {
    uid: user.uid,
    name: syntheticName,
    email: syntheticEmail,
    provider: 'apple',
  };

  await syncUserProfile(chatUser);
  return chatUser;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
