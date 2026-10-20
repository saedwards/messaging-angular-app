import { TestBed } from '@angular/core/testing';
import { onlyCompleteData } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { firstValueFrom } from 'rxjs';

import { MessagesData } from './messages-data';
import { createMessageFixture } from './messages.fixtures';

describe('MessagesData', () => {
  let service: MessagesData;
  let controller: ApolloTestingController;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });

    service = TestBed.inject(MessagesData);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => controller.verify());

  async function loadMessages(messages = [createMessageFixture()]) {
    const result = firstValueFrom(service.watchMessages().valueChanges.pipe(onlyCompleteData()));
    controller.expectOne('GetMessages').flushData({ messages });
    await result;
  }

  function cachedMessageIds() {
    return service
      .watchMessages()
      .getCurrentResult()
      .data?.messages?.map((message) => message?.id);
  }

  it('requests the latest messages', async () => {
    const result = firstValueFrom(service.watchMessages().valueChanges.pipe(onlyCompleteData()));
    const op = controller.expectOne('GetMessages');

    expect(op.operation.variables).toEqual({ max: 4 });

    op.flushData({ messages: [] });
    expect((await result).data).toEqual({ messages: [] });
  });

  it('sends message text as a variable and prepends the result to the cached conversation', async () => {
    await loadMessages();

    const sent = firstValueFrom(service.sendMessage('Hi "there"'));
    const op = controller.expectOne('CreateMessage');

    expect(op.operation.variables).toEqual({ text: 'Hi "there"' });

    op.flushData({ createMessage: createMessageFixture({ id: 'message2', fromYou: true }) });
    await sent;

    expect(cachedMessageIds()).toEqual(['message2', 'message1']);
    expect(service.newMessageIds().has('message2')).toBe(true);
  });

  it('ignores a message that is already cached', async () => {
    await loadMessages();

    service.addMessage(createMessageFixture());

    expect(cachedMessageIds()).toEqual(['message1']);
    expect(service.newMessageIds().size).toBe(0);
  });

  it('adds subscribed messages to the cached conversation', async () => {
    await loadMessages();

    const added = firstValueFrom(service.messageAdded());
    controller.expectOne('OnMessageAdded').flushData({ messageAdded: createMessageFixture({ id: 'message3' }) });

    expect((await added).id).toBe('message3');
    expect(cachedMessageIds()).toEqual(['message3', 'message1']);
  });

  it('stops tracking a message once it has animated', async () => {
    await loadMessages();
    service.addMessage(createMessageFixture({ id: 'message4' }));

    service.messageAnimated('message4');

    expect(service.newMessageIds().has('message4')).toBe(false);
  });
});
