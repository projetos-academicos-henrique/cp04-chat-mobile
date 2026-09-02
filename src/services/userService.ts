import { ref, set, get, onValue, off, DataSnapshot } from 'firebase/database';
import { db } from './firebase';
import type { ChatUser, AuthProvider } from '../types/user';

interface UserRecord {
  name: string;
  email: string | null;
  provider: AuthProvider;
}

export async function syncUserProfile(user: ChatUser): Promise<void> {
  try {
    const userRef = ref(db, `users/${user.uid}`);
    const record: UserRecord = {
      name: user.name,
      email: user.email,
      provider: user.provider,
    };
    await set(userRef, record);
  } catch (err) {
    console.warn('Aviso ao sincronizar perfil no Realtime Database:', err);
  }
}

export async function getUserProfile(
  uid: string,
  timeoutMs: number = 2500
): Promise<ChatUser | null> {
  const userRef = ref(db, `users/${uid}`);

  const fetchPromise = get(userRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return null;
      }
      const data = snapshot.val() as UserRecord;
      return {
        uid,
        name: data.name || 'Usuário',
        email: data.email || null,
        provider: data.provider,
      };
    })
    .catch((err) => {
      console.warn('Aviso ao consultar perfil no Realtime Database:', err);
      return null;
    });

  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

export function subscribeToUsers(
  callback: (users: ChatUser[]) => void,
  onError?: (error: Error) => void
): () => void {
  const usersRef = ref(db, 'users');

  const listener = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val() as Record<string, UserRecord>;
    const userList: ChatUser[] = Object.keys(data).map((uid) => ({
      uid,
      name: data[uid].name || 'Sem Nome',
      email: data[uid].email || null,
      provider: data[uid].provider,
    }));

    callback(userList);
  };

  const errorListener = (err: Error) => {
    console.warn('Erro ao escutar usuários no Realtime Database:', err);
    if (onError) {
      onError(err);
    } else {
      callback([]);
    }
  };

  onValue(usersRef, listener, errorListener);

  return () => {
    off(usersRef, 'value', listener);
  };
}
