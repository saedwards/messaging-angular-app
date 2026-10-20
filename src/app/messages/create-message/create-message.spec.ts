import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MessagesData } from '../messages-data';
import { CreateMessage } from './create-message';

describe('CreateMessage', () => {
  let fixture: ComponentFixture<CreateMessage>;
  let sendMessage: ReturnType<typeof vi.fn>;
  let textarea: HTMLTextAreaElement;

  beforeEach(async () => {
    sendMessage = vi.fn(() => of({ data: undefined }));

    TestBed.configureTestingModule({
      imports: [CreateMessage],
      providers: [{ provide: MessagesData, useValue: { sendMessage } }],
    });

    fixture = TestBed.createComponent(CreateMessage);
    await fixture.whenStable();
    textarea = fixture.nativeElement.querySelector('textarea');
  });

  async function type(text: string) {
    textarea.value = text;
    textarea.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('has an accessible label for the message input', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(textarea.id);
  });

  it('sends the trimmed message on Enter and clears the input', async () => {
    await type('  Hello there  ');

    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();

    expect(sendMessage).toHaveBeenCalledWith('Hello there');
    expect(textarea.value).toBe('');
  });

  it('sends the message when the button is clicked', async () => {
    await type('Hello');

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(sendMessage).toHaveBeenCalledWith('Hello');
  });

  it('does not send an empty message', async () => {
    await type('   ');

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(sendMessage).not.toHaveBeenCalled();
  });
});
