# CP4 --- React Native: Chat com Firebase (Authentication + Realtime Database)

Aplicativo móvel de **chat em tempo real 1-para-1** desenvolvido em **React Native** com **Expo SDK 55** e **TypeScript**, integrado ao **Firebase Authentication** e ao **Firebase Realtime Database**.

---

## Integrantes

| Nome Completo | RM |
| :--- | :--- |
| **[Andrey Rodrigues Nagata]** | 555339 |
| **[Henrique Soubhia]** | 554493 |
| **[Oliver Kanai Trindade]** | 554954 |
| **[Pedro Gutierre Cardoso de Oliveira]** | 555445 |
| **[William Weile Feng]** | 555132 |

---

## Objetivo e Descrição

O aplicativo permite que usuários realizem autenticação por múltiplos provedores e troquem mensagens de forma instantânea e sincronizada em tempo real. Cada conversa é estritamente entre **duas pessoas** (1-para-1).

### Regra de Comunicação por Tipo de Autenticação

A comunicação entre os participantes é regida obrigatoriamente pela forma utilizada para autenticação:

```text
E-mail/Senha  ────── conversa exclusivamente com ──────►  Google OU Apple
Google/Apple  ────── conversa exclusivamente com ──────►  E-mail/Senha
```

- **Combinações Permitidas**:
  - `E-mail/Senha` ↔ `Google`
  - `E-mail/Senha` ↔ `Apple`
- **Combinações Proibidas**:
  - `E-mail/Senha` ↔ `E-mail/Senha` (bloqueado)
  - `Google` ↔ `Google` (bloqueado)
  - `Apple` ↔ `Apple` (bloqueado)
  - `Google` ↔ `Apple` (bloqueado)
  - Conversa consigo mesmo (bloqueado)

A tela de contatos filtra automaticamente a listagem para apresentar **apenas contatos compatíveis** para o usuário logado.

---

## Identidade Visual e Design System

Conforme as diretrizes especificadas para o projeto:
1. **Tema Dark Mode**: Interface escura profunda em todas as telas.
2. **Sem Bordas Arredondadas**: `borderRadius: 0` aplicado rigorosamente em botões, campos de digitação, balões de conversa, avatares e cartões.
3. **Tipografia Roboto**: Fonte Roboto aplicada em títulos, textos e metadados.
4. **Paleta de Cores**:
   - **Cor Principal**: `#ed145b` (Magenta vibrante)
   - **Cor de Texto**: `#B7B7B7` (Prata suave para leitura confortável)
   - **Cor Auxiliar**: `#ACC1CC` (Gelo/Azul acinzentado para bordas e badges)
   - **Fundo**: `linear-gradient(90deg, #343A3C -30%, #000000 50%, #343A3C 130%)` com `expo-linear-gradient`.

---

## Tecnologias Utilizadas

- **React Native** (0.83)
- **Expo SDK 55**
- **TypeScript** (Modo estrito, sem uso de `any`)
- **React Navigation 7** (`@react-navigation/native-stack`)
- **Firebase 12**:
  - **Firebase Authentication** (E-mail/Senha, Google, Apple)
  - **Firebase Realtime Database** (Não utiliza Cloud Firestore)
- **Expo Linear Gradient** (`expo-linear-gradient`)
- **Google Fonts Roboto** (`@expo-google-fonts/roboto`, `expo-font`)
- **React Native Safe Area Context & Screens**

---

## Estrutura do Projeto

```text
cp4-chat-firebase/
├── .agents/
│   └── skills/
│       ├── react-native-best-practices/   # Skill Callstack de performance e boas práticas
│       └── react-navigation/              # Skill Callstack de navegação React Navigation 7
├── assets/                                # Ícones e splash screen
├── src/
│   ├── components/                        # Componentes reutilizáveis
│   │   ├── ChatInput.tsx                  # Input de mensagem sem bordas arredondadas
│   │   ├── ChatMessage.tsx                # Balão de mensagem (enviada vs recebida)
│   │   ├── CustomHeader.tsx               # Header geométrico com botão voltar e logout
│   │   ├── ErrorMessage.tsx               # Alertas de erro customizados
│   │   ├── GradientBackground.tsx         # Fundo com Linear Gradient de 90 graus
│   │   ├── Loading.tsx                    # Feedback de carregamento
│   │   └── UserItem.tsx                   # Item de contato com badge do provedor
│   ├── contexts/
│   │   └── AuthContext.tsx                # Contexto global com onAuthStateChanged
│   ├── hooks/
│   │   ├── useAuth.ts                     # Hook de autenticação
│   │   └── useChat.ts                     # Hook da conversa em tempo real
│   ├── screens/
│   │   ├── LoginScreen.tsx                # Tela de Login/Cadastro (Email, Google, Apple)
│   │   ├── UsersScreen.tsx                # Listagem exclusiva de contatos compatíveis
│   │   └── ChatScreen.tsx                 # Chat 1-para-1 em tempo real
│   ├── services/
│   │   ├── authService.ts                 # Operações de Auth (cadastro, login, logout)
│   │   ├── chatService.ts                 # Operações de conversa e mensagens no RTDB
│   │   ├── firebase.ts                    # Inicialização do Firebase e Realtime Database
│   │   └── userService.ts                 # Sincronização de perfis de usuário
│   ├── types/
│   │   ├── chat.ts                        # Tipagens: Conversation, ChatMessage
│   │   ├── navigation.ts                  # Tipagem de rotas RootStackParamList
│   │   └── user.ts                        # Tipagens: AuthProvider, ChatUser
│   └── utils/
│       ├── chatRules.ts                   # Implementação das regras de compatibilidade
│       └── formatters.ts                  # Formatação de horários e iniciais
├── App.tsx                                # Entrada principal e carregamento de fontes
├── app.json                               # Configurações do Expo
├── database.rules.json                    # Regras de segurança do Realtime Database
├── package.json
├── tsconfig.json
└── README.md
```

---

## Configuração do Firebase

### 1. Criar o Projeto no Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com/) e clique em **Adicionar projeto**.
2. Dê um nome ao projeto (ex: `cp4-chat-firebase`).

### 2. Ativar o Firebase Authentication
1. No menu lateral, acesse **Authentication** > **Começar**.
2. Na aba **Sign-in method**, ative os seguintes provedores:
   - **E-mail/senha**: Ative a primeira opção ("Permitir que os usuários façam login com o e-mail e a senha").
   - **Google**: Ative e informe o e-mail de suporte.
   - **Apple**: Ative o provedor da Apple.

### 3. Criar e Configurar o Realtime Database
1. No menu lateral, vá para **Realtime Database** > **Criar banco de dados**.
2. Escolha o local do servidor (ex: `United States` ou mais próximo).
3. Na aba **Regras**, cole as regras de segurança contidas no arquivo `database.rules.json` deste projeto:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "conversations": {
      ".read": "auth != null",
      "$conversationId": {
        ".write": "auth != null && (!data.exists() || data.child('participants/0').val() == auth.uid || data.child('participants/1').val() == auth.uid)"
      }
    },
    "messages": {
      "$conversationId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "$messageId": {
          ".validate": "newData.hasChildren(['id', 'conversationId', 'senderId', 'receiverId', 'text', 'createdAt']) && newData.child('senderId').val() == auth.uid"
        }
      }
    }
  }
}
```

### 4. Obter as Credenciais do Aplicativo
1. No console, acesse **Configurações do Projeto** (ícone de engrenagem) > **Geral**.
2. Em "Seus aplicativos", adicione um app da Web (`</>`).
3. Copie o objeto `firebaseConfig` gerado e preencha no arquivo `src/services/firebase.ts` ou crie um arquivo `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://seu_projeto-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

---

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior, recomendado 20+)
- **npm** ou **yarn**
- Aplicativo **Expo Go** instalado no celular (Android ou iOS) ou emulador configurado.

### Instalação e Execução

1. Clone o repositório ou acesse o diretório do projeto:
```bash
cd cp4-chat-firebase
```

2. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

3. Inicie o servidor Expo:
```bash
npx expo start
```

4. Para testar:
   - **No Celular**: Abra a câmera (iOS) ou o app Expo Go (Android) e escaneie o QR Code exibido no terminal.
   - **No Navegador (Web)**: Pressione `w` no terminal.
   - **No Emulador Android**: Pressione `a`.
   - **No Simulador iOS**: Pressione `i`.

---

## Screenshots da Aplicação

> Substitua as imagens abaixo com os prints da execução do aplicativo:

| Tela de Login / Cadastro | Lista de Contatos Compatíveis | Chat 1-para-1 em Tempo Real |
| :---: | :---: | :---: |
| ![Login](https://via.placeholder.com/250x500/121517/ed145b?text=Login+Screen) | ![Contatos](https://via.placeholder.com/250x500/121517/ACC1CC?text=Users+Screen) | ![Chat](https://via.placeholder.com/250x500/121517/ed145b?text=Chat+Screen) |

---

## Verificação e Ausência de `any`

O projeto segue tipagem estrita com TypeScript. Para verificar os tipos sem emitir código:

```bash
npm run typecheck
```
