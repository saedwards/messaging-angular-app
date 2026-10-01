import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { CreateMessageComponent } from './create-message.component';

describe('CreateMessageComponent', () => {
  let component: CreateMessageComponent;
  let fixture: ComponentFixture<CreateMessageComponent>;
  let apollo: { mutate: jasmine.Spy };

  beforeEach(async(() => {
    apollo = {
      mutate: jasmine.createSpy('mutate').and.returnValue(of({}))
    };

    TestBed.configureTestingModule({
      declarations: [CreateMessageComponent],
      imports: [FormsModule],
      providers: [{ provide: Apollo, useValue: apollo }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('passes message text as a GraphQL variable', () => {
    component.text = 'Message "quoted" \\ path';
    component.sendMessage();

    const mutationOptions = apollo.mutate.calls.mostRecent().args[0];
    expect(mutationOptions.variables).toEqual({ text: 'Message "quoted" \\ path' });
    expect(mutationOptions.mutation.loc.source.body).toContain('createMessage(text: $text)');
  });

  it('does not send an empty message', () => {
    component.sendMessage();

    expect(apollo.mutate).not.toHaveBeenCalled();
  });
});
