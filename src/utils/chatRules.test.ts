import { isCompatibleProvider, canCommunicate, getConversationId } from './chatRules.ts';
import type { ChatUser } from '../types/user.ts';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('--- Testando Regras de Compatibilidade entre Provedores ---');

// Regras permitidas
assert(isCompatibleProvider('password', 'google') === true, 'password -> google deve ser permitido');
assert(isCompatibleProvider('password', 'apple') === true, 'password -> apple deve ser permitido');
assert(isCompatibleProvider('google', 'password') === true, 'google -> password deve ser permitido');
assert(isCompatibleProvider('apple', 'password') === true, 'apple -> password deve ser permitido');

// Regras proibidas
assert(isCompatibleProvider('password', 'password') === false, 'password -> password NÃO deve ser permitido');
assert(isCompatibleProvider('google', 'google') === false, 'google -> google NÃO deve ser permitido');
assert(isCompatibleProvider('apple', 'apple') === false, 'apple -> apple NÃO deve ser permitido');
assert(isCompatibleProvider('google', 'apple') === false, 'google -> apple NÃO deve ser permitido');
assert(isCompatibleProvider('apple', 'google') === false, 'apple -> google NÃO deve ser permitido');

console.log('\n--- Testando canCommunicate e Bloqueio de Conversa Consigo Mesmo ---');

const userEmail: ChatUser = { uid: 'u1', name: 'User 1', email: 'u1@test.com', provider: 'password' };
const userGoogle: ChatUser = { uid: 'u2', name: 'User 2', email: 'u2@test.com', provider: 'google' };
const userApple: ChatUser = { uid: 'u3', name: 'User 3', email: 'u3@test.com', provider: 'apple' };
const userEmail2: ChatUser = { uid: 'u4', name: 'User 4', email: 'u4@test.com', provider: 'password' };

assert(canCommunicate(userEmail, userGoogle) === true, 'userEmail pode conversar com userGoogle');
assert(canCommunicate(userEmail, userApple) === true, 'userEmail pode conversar com userApple');
assert(canCommunicate(userGoogle, userEmail) === true, 'userGoogle pode conversar com userEmail');
assert(canCommunicate(userApple, userEmail) === true, 'userApple pode conversar com userEmail');

// Bloqueio consigo mesmo
assert(canCommunicate(userEmail, userEmail) === false, 'Usuário NÃO pode conversar consigo mesmo');
assert(canCommunicate(userGoogle, userGoogle) === false, 'Usuário Google NÃO pode conversar consigo mesmo');

// Bloqueio de mesma categoria
assert(canCommunicate(userEmail, userEmail2) === false, 'Usuários de E-mail NÃO podem conversar entre si');
assert(canCommunicate(userGoogle, userApple) === false, 'Usuários Google e Apple NÃO podem conversar entre si');

console.log('\n--- Testando Identificador Determinístico de Conversa ---');
assert(getConversationId('uid_abc', 'uid_xyz') === 'uid_abc_uid_xyz', 'Conversa a-z');
assert(getConversationId('uid_xyz', 'uid_abc') === 'uid_abc_uid_xyz', 'Conversa z-a gera o mesmo ID determinístico');

console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
