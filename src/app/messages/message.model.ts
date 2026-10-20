/**
 * Shapes of the selection sets in `messages.operations.ts`. Nullability mirrors `schema.graphql`.
 */
export interface ConversationUser {
  __typename: 'User';
  id: string | null;
  name: string | null;
  colour: string | null;
  avatarUrl: string | null;
}

export interface ConversationMessage {
  __typename: 'Message';
  id: string | null;
  text: string | null;
  fromYou: boolean | null;
  timestamp: string | null;
  user: ConversationUser | null;
}

export interface GetMessagesData {
  messages: Array<ConversationMessage | null> | null;
}

export interface GetMessagesVariables {
  max: number;
}

export interface CreateMessageData {
  createMessage: ConversationMessage | null;
}

export interface CreateMessageVariables {
  text: string;
}

export interface OnMessageAddedData {
  messageAdded: ConversationMessage | null;
}

export interface MessageView {
  id: string;
  sent: Date;
  text: string;
  fromYou: boolean;
  isNew: boolean;
  user: {
    name: string;
    colour: string;
    avatarUrl: string;
  };
}
