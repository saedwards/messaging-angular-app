import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { createMessageFixture } from '../messages.fixtures';
import { ViewConversation } from './view-conversation';

describe('ViewConversation', () => {
  let fixture: ComponentFixture<ViewConversation>;
  let controller: ApolloTestingController;
  let el: HTMLElement;

  beforeEach(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    // Not implemented by jsdom
    Element.prototype.scrollTo = vi.fn();

    TestBed.configureTestingModule({ imports: [ViewConversation, ApolloTestingModule] });

    controller = TestBed.inject(ApolloTestingController);
    fixture = TestBed.createComponent(ViewConversation);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  /**
   * Apollo Client notifies watched queries of cache writes asynchronously, outside of Angular's pending tasks
   */
  async function cacheBroadcast() {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  function messageTexts() {
    return Array.from(el.querySelectorAll('.messages-view-conversation__message')).map((message) =>
      message.textContent?.trim(),
    );
  }

  it('prompts for a message when the conversation is empty', async () => {
    controller.expectOne('GetMessages').flushData({ messages: [] });
    await fixture.whenStable();

    expect(el.querySelector('h1')?.textContent).toContain('Write a message');
  });

  it('shows the oldest message first', async () => {
    controller.expectOne('GetMessages').flushData({
      messages: [
        createMessageFixture({ id: 'message2', text: 'Second' }),
        createMessageFixture({ id: 'message1', text: 'First' }),
      ],
    });
    await fixture.whenStable();

    expect(messageTexts()).toEqual(['Ada First', 'Ada Second']);
  });

  it('appends subscribed messages and marks them as new', async () => {
    controller.expectOne('GetMessages').flushData({ messages: [createMessageFixture()] });
    await fixture.whenStable();

    controller
      .expectOne('OnMessageAdded')
      .flushData({ messageAdded: createMessageFixture({ id: 'message2', text: 'Another' }) });
    await cacheBroadcast();

    const items = el.querySelectorAll('.messages-view-conversation__item');
    expect(messageTexts()).toEqual(['Ada Hello', 'Ada Another']);
    expect(items[1].classList).toContain('messages-view-conversation__item--new');
  });

  it('reports a failure to load messages', async () => {
    controller.expectOne('GetMessages').networkError(new Error('offline'));
    await fixture.whenStable();

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Messages could not be loaded');
  });
});
