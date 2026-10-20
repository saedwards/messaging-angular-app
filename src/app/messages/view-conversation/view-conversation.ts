import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  concat,
  filter,
  map,
  merge,
  of,
  switchMap,
  timer,
} from 'rxjs';

import { isPresent, logResult } from '../../shared/utils';
import { ConversationMessage, MessageView } from '../message.model';
import { MessagesData } from '../messages-data';

const USER_TYPING_TIMEOUT_MS = 10_000;
const DEFAULT_COLOUR = 'dca629';
const DEFAULT_AVATAR_URL = 'assets/avatar.png';

function toMessageView(message: ConversationMessage): MessageView {
  const id = message.id ?? '';

  return {
    id,
    sent: new Date(parseInt(message.timestamp ?? '0', 10) * 1000),
    text: message.text ?? '',
    fromYou: message.fromYou ?? false,
    isNew: false,
    user: {
      name: message.user?.name ?? '',
      colour: message.user?.colour || DEFAULT_COLOUR,
      avatarUrl: message.user?.avatarUrl || DEFAULT_AVATAR_URL,
    },
  };
}

@Component({
  selector: 'app-view-conversation',
  imports: [DatePipe],
  templateUrl: './view-conversation.html',
  styleUrl: './view-conversation.scss',
})
export class ViewConversation {
  private readonly messagesData = inject(MessagesData);
  private readonly scrollTarget = viewChild.required<ElementRef<HTMLElement>>('scrollTarget');

  readonly messagesUpdated = output<void>();

  private readonly messagesResult = toSignal(
    this.messagesData.watchMessages().valueChanges.pipe(logResult('Messages GQL result')),
  );

  protected readonly loadError = computed(() => this.messagesResult()?.error);

  protected readonly messagesLoaded = computed(() => this.messagesResult()?.dataState === 'complete');

  protected readonly messages = computed(() => {
    const result = this.messagesResult();
    const newIds = this.messagesData.newMessageIds();

    if (result?.dataState !== 'complete') {
      return [];
    }

    return (result.data.messages ?? [])
      .filter(isPresent)
      .map((message) => toMessageView(message))
      .reverse();
  });

  constructor() {
    afterRenderEffect(() => {
      this.messages();

      const el = this.scrollTarget().nativeElement;
      el.scrollTo({ top: el.scrollHeight });
    });
  }

  protected onNewMessageAnimated(id: string) {
    this.messagesData.messageAnimated(id);
  }
}
