import { Injectable, inject, signal } from '@angular/core';
import {ApolloCache, ApolloClient} from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { Observable, filter, map, tap } from 'rxjs';

import { isPresent, logResult } from '../shared/utils';
import {ConversationMessage, OnMessageAddedData} from './message.model';
import {
  CREATE_MESSAGE,
  GET_MESSAGES,
  MESSAGES_MAX,
  ON_MESSAGE_ADDED,
} from './messages.operations';
import SubscribeResult = ApolloClient.SubscribeResult;

@Injectable({ providedIn: 'root' })
export class MessagesData {
  private readonly apollo = inject(Apollo);
  private readonly newIds = signal<ReadonlySet<string>>(new Set());

  /**
   * Messages added since the conversation loaded, which still need to play their entrance animation
   */
  readonly newMessageIds = this.newIds.asReadonly();

  watchMessages() {
    return this.apollo.watchQuery({
      query: GET_MESSAGES,
      variables: { max: MESSAGES_MAX },
    });
  }

  /**
   * Emits each message pushed by the server, after it has been added to the cached conversation
   */
  messageAdded(): Observable<ConversationMessage> {
    return this.apollo.subscribe({ query: ON_MESSAGE_ADDED }).pipe(
      logResult('messageAdded GQL result'),
      map((result: SubscribeResult<OnMessageAddedData>) => result.data?.messageAdded),
      filter(isPresent),
      tap((message) => this.addMessage(message)),
    );
  }

  sendMessage(text: string) {
    return this.apollo
      .mutate({
        mutation: CREATE_MESSAGE,
        variables: { text },
        update: (cache, { data }) => {
          if (data?.createMessage) {
            this.appendMessage(cache, data.createMessage);
          }
        },
      })
      .pipe(logResult('createMessage GQL result'));
  }

  /**
   * Adds a message to the cached conversation without a server round trip
   */
  addMessage(message: ConversationMessage) {
    this.appendMessage(this.apollo.client.cache, message);
  }

  messageAnimated(id: string) {
    this.newIds.update((ids) => {
      const next = new Set(ids);
      next.delete(id);
      return next;
    });
  }

  /**
   * Messages can arrive from both the mutation response and the subscription, so ignore ones already cached.
   * The server returns the newest message first.
   */
  private appendMessage(cache: ApolloCache, message: ConversationMessage) {
    const query = { query: GET_MESSAGES, variables: { max: MESSAGES_MAX } };
    const messages = cache.readQuery(query)?.messages ?? [];
    const { id } = message;

    if (!id || messages.some((cached) => cached?.id === id)) {
      return;
    }

    this.newIds.update((ids) => new Set(ids).add(id));
    cache.writeQuery({ ...query, data: { messages: [message, ...messages] } });
  }
}
