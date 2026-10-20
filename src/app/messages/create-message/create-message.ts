import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { MessagesData } from '../messages-data';

@Component({
  selector: 'app-create-message',
  imports: [FormField],
  templateUrl: './create-message.html',
  styleUrl: './create-message.scss',
})
export class CreateMessage {
  private readonly messagesData = inject(MessagesData);

  protected readonly messageModel = signal({ text: '' });
  protected readonly messageForm = form(this.messageModel, (path) => {
    required(path.text);
  });

  protected sendMessage(event: Event) {
    event.preventDefault();

    submit(this.messageForm, async () => {
      const text = this.messageModel().text.trim();

      if (!text) {
        return;
      }

      this.messageForm().reset({ text: '' });
      await firstValueFrom(this.messagesData.sendMessage(text));
    });
  }
}
