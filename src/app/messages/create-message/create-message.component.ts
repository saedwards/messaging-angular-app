import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import conversationMessageFragment from '../shared/conversation-message-fragment.gql';

const CREATE_MESSAGE = gql`
  mutation createMessage($text: String!) {
    createMessage(text: $text) {
      ...conversationMessage
    }
  }
  ${conversationMessageFragment}
`;

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss']
})
export class CreateMessageComponent {
  text: string = '';

  constructor(private apollo: Apollo) { }

  sendMessage(): void {
    if (!this.text) {
      return;
    }

    const messageText = this.text.replace('\n', '');
    this.text = '';

    this.apollo
      .mutate({
        mutation: CREATE_MESSAGE,
        variables: { text: messageText }
      })
      .subscribe();
  }
}
