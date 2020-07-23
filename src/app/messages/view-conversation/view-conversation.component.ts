import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RetrieveMessagesService } from '../shared/retrieve-messages.service';
import { ApolloQueryResult } from "apollo-client";
import { MessageSubscriptionGQLService } from '../shared/message-subscription-gql.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { newMessageAnimation } from '../shared/new-message.animation';

interface MessageModel {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  fromYou: boolean;
  user: any;
}

interface MessageViewModel {
  id: string;
  sent: Date;
  text: string;
  user: {
    name: string;
    avatarUrl: string;
    colour: string;
  };
  fromYou: boolean;
  spacer?: Boolean;
  isNew?: Boolean;
}

@Component({
  selector: 'app-view-conversation',
  templateUrl: './view-conversation.component.html',
  styleUrls: ['./view-conversation.component.scss'],
  animations: [
    trigger('newMessage', [
      transition(':enter', [
        useAnimation(newMessageAnimation)
      ])
    ])
  ]
})
export class ViewConversationComponent implements OnInit {
  messages: Array<MessageViewModel> = [];

  @Output()
  messagesUpdatedEvent = new EventEmitter();

  constructor(
    private retrieveMessagesService: RetrieveMessagesService,
    private messageSubscriptionGQLService: MessageSubscriptionGQLService
  ) {}

  static createMessageInstance(messageData: MessageModel): MessageViewModel {
    return <MessageViewModel>{
      ...messageData,
      sent: new Date(parseInt(messageData.timestamp) * 1000),
      user: {
        ...messageData.user,
        avatarUrl: messageData.user.avatarUrl || 'assets/avatar.png'
      }
    };
  }

  ngOnInit() {
    this.retrieveMessagesService
      .fetch({ max: 4 })
      .subscribe((result: ApolloQueryResult<any>) => this.updateMessages(result));

    this.messageSubscriptionGQLService
      .subscribe()
      .subscribe(this.messageReceived.bind(this));
  }

  updateMessages(result: ApolloQueryResult<{messages: Array<MessageModel>}>) {
    if (!result || !result.data || !result.data.messages) {
      return false;
    }

    this.messages = result.data.messages.map(ViewConversationComponent.createMessageInstance).reverse();
    this.messagesUpdatedEvent.emit();
  }

  addNewMessage(messageData: any) {
    this.messages.push(
      ViewConversationComponent.createMessageInstance({
        ...messageData,
        isNew: true
      })
    );

    this.messages.push(
      ViewConversationComponent.createMessageInstance({
        ...messageData,
        spacer: true
      })
    );
  }

  onNewMessageAnimated(event, newMessageInstance) {
    const spacerInstanceIndex = this.messages.findIndex(message => message.spacer && message.id === newMessageInstance.id);

    if (spacerInstanceIndex > -1) {
      this.messages.splice(spacerInstanceIndex, 1);
      newMessageInstance.isNew = false;
    }
  }

  messageReceived(result: ApolloQueryResult<{messageAdded: MessageModel}>) {
    if (!result || !result.data || !result.data.messageAdded) {
      return;
    }

    this.addNewMessage(result.data.messageAdded);
    this.messagesUpdatedEvent.emit();
  }
}
