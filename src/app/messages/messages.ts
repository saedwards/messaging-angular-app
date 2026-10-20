import { Component, ElementRef, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { environment } from '../../environments/environment';
import { scrollToEl } from '../shared/utils';
import { CreateMessage } from './create-message/create-message';
import { ViewConversation } from './view-conversation/view-conversation';

@Component({
  selector: 'app-messages',
  imports: [NgOptimizedImage, ViewConversation, CreateMessage],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages {
  private readonly containerEl = viewChild.required<ElementRef<HTMLElement>>('containerEl');

  protected scrollToContainerBottom() {
    scrollToEl(this.containerEl().nativeElement, { instantly: true });
  }
}
