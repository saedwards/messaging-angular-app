import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import conversationMessageFragment from '../shared/conversation-message-fragment.gql';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss']
})
export class CreateMessageComponent implements OnInit {
  text: String = '';

  constructor(private apollo: Apollo) { }

  ngOnInit() {}

  sendMessage() {
    if (!this.text) {
      return false;
    }

    const textCache = this.text;
    this.text = '';

    this.apollo
      .mutate({
        mutation: gql`
            mutation createMessage {
              createMessage(text: "${textCache.replace('\n', '')}") {
                ...conversationMessage
              }
            }
            ${conversationMessageFragment}
          `
      })
      .subscribe();
  }
}
