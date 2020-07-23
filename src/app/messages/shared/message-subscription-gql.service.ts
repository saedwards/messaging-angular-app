import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Subscription } from 'apollo-angular';
import conversationMessageFragment from './conversation-message-fragment.gql';

@Injectable({
  providedIn: 'root'
})
export class MessageSubscriptionGQLService extends Subscription {
  document = gql`
      subscription {
          messageAdded {
              ...conversationMessage
          }
      }
      ${conversationMessageFragment}
  `;
}
