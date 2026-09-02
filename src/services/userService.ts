import { ref, set, get, onValue, off, DataSnapshot } from 'firebase/database';
import { db } from './firebase';
import type { ChatUser, AuthProvider } from '../types/user';

interface UserRecord {
  name: string;
  email: string | null;
  provider: AuthProvider;
}

export async function syncUserProfile(user: ChatUser): Promise<void> {
  const userRef = ref(db, `users/${user.uid}`);
  const record: UserRecord = {
    name: user.name,
    email: user.email,
    provider: user.provider,
  };
  await set(userRef, record);
}

export async function getUserProfile(uid: string): Promise<ChatUser | null> {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
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
}

export function subscribeToUsers(callback: (users: ChatUser[]) => void): () => void {
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

  onValue(usersRef, listener);

  return () => {
    off(usersRef, 'value', listener);
  };
}
