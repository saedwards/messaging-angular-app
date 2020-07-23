import { TestBed } from '@angular/core/testing';

import { MessageSubscriptionGqlService } from './message-subscription-gql.service';

describe('MessageSubscriptionGqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageSubscriptionGqlService = TestBed.get(MessageSubscriptionGqlService);
    expect(service).toBeTruthy();
  });
});
