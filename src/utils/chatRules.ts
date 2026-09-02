import type { AuthProvider, ChatUser } from '../types/user';

/**
 * Regra do CP:
 * E-mail/Senha conversa exclusivamente com Google OU Apple.
 * Google OU Apple conversa exclusivamente com E-mail/Senha.
 *
 * Combinações permitidas:
 * - password <-> google
 * - password <-> apple
 * - google <-> password
 * - apple <-> password
 *
 * Combinações NÃO permitidas:
 * - password <-> password
 * - google <-> google
 * - apple <-> apple
 * - google <-> apple
 */
export function isCompatibleProvider(
  userAProvider: AuthProvider,
  userBProvider: AuthProvider
): boolean {
  if (userAProvider === 'password') {
    return userBProvider === 'google' || userBProvider === 'apple';
  }

  if (userAProvider === 'google' || userAProvider === 'apple') {
    return userBProvider === 'password';
  }

  return false;
}

/**
 * Valida se dois usuários podem conversar no chat 1-para-1.
 * O usuário não pode conversar consigo mesmo e os provedores devem ser compatíveis.
 */
export function canCommunicate(userA: ChatUser, userB: ChatUser): boolean {
  if (userA.uid === userB.uid) {
    return false;
  }
  return isCompatibleProvider(userA.provider, userB.provider);
}

/**
 * Gera um identificador único determinístico para a conversa 1-para-1
 * ordenando os UIDs em ordem alfabética.
 */
export function getConversationId(uid1: string, uid2: string): string {
  const [first, second] = [uid1, uid2].sort();
  return `${first}_${second}`;
}

export function getProviderDisplayName(provider: AuthProvider): string {
  switch (provider) {
    case 'password':
      return 'E-mail / Senha';
    case 'google':
      return 'Google';
    case 'apple':
      return 'Apple';
    default: {
      const _exhaustive: never = provider;
      return _exhaustive;
    }
  }
}

export function getProviderBadgeColor(provider: AuthProvider): string {
  switch (provider) {
    case 'password':
      return '#ed145b'; // cor principal
    case 'google':
      return '#ACC1CC'; // cor auxiliar
    case 'apple':
      return '#FFFFFF';
    default:
      return '#B7B7B7';
  }
}
