import type { ChatUser } from './user';

export type RootStackParamList = {
  Login: undefined;
  Users: undefined;
  Chat: {
    targetUser: ChatUser;
  };
};
