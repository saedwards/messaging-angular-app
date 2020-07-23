import { TestBed } from '@angular/core/testing';

import { RetrieveMessagesService } from './retrieve-messages.service';

describe('RetrieveMessagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetrieveMessagesService = TestBed.get(RetrieveMessagesService);
    expect(service).toBeTruthy();
  });
});
