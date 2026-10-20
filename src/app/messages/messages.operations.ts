import { gql } from 'apollo-angular';

import {
  CreateMessageData,
  CreateMessageVariables,
  GetMessagesData,
  GetMessagesVariables,
  OnMessageAddedData,
} from './message.model';

export const MESSAGES_MAX = 4;

export const CONVERSATION_USER_FRAGMENT = gql`
  fragment ConversationUser on User {
    id
    name
    colour
    avatarUrl
  }
`;

export const CONVERSATION_MESSAGE_FRAGMENT = gql`
  fragment ConversationMessage on Message {
    id
    text
    fromYou
    timestamp
    user {
      ...ConversationUser
    }
  }
  ${CONVERSATION_USER_FRAGMENT}
`;

export const GET_MESSAGES = gql<GetMessagesData, GetMessagesVariables>`
  query GetMessages($max: Int) {
    messages(max: $max) {
      ...ConversationMessage
    }
  }
  ${CONVERSATION_MESSAGE_FRAGMENT}
`;

export const CREATE_MESSAGE = gql<CreateMessageData, CreateMessageVariables>`
  mutation CreateMessage($text: String) {
    createMessage(text: $text) {
      ...ConversationMessage
    }
  }
  ${CONVERSATION_MESSAGE_FRAGMENT}
`;

export const ON_MESSAGE_ADDED = gql<OnMessageAddedData, Record<string, never>>`
  subscription OnMessageAdded {
    messageAdded {
      ...ConversationMessage
    }
  }
  ${CONVERSATION_MESSAGE_FRAGMENT}
`;

