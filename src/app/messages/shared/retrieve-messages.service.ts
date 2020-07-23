import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Query } from 'apollo-angular';
import conversationMessageFragment from './conversation-message-fragment.gql';

@Injectable({
  providedIn: 'root'
})
export class RetrieveMessagesService extends Query<Response> {
  document = gql`
      query Messages($max: Int) {
          messages(max: $max) {
              ...conversationMessage
          }
      }
      ${conversationMessageFragment}
  `;
}
