import { ConversationMessage } from './message.model';

export function createMessageFixture(overrides: Partial<ConversationMessage> = {}): ConversationMessage {
  return {
    __typename: 'Message',
    id: 'message1',
    text: 'Hello',
    fromYou: false,
    timestamp: '1700000000',
    user: {
      __typename: 'User',
      id: 'user1',
      name: 'Ada',
      colour: '4bbe2e',
      avatarUrl: null,
    },
    ...overrides,
  };
}
