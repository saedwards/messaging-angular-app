import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @ViewChild('containerEl', { static: true })
  containerEl: any;

  constructor() { }

  ngOnInit() {
  }

  scrollToContainerBottom() {
    const config = {
      behavior: 'auto',
      block: 'end',
      inline: 'nearest'
    };

    setTimeout(() => {
      this.containerEl.nativeElement.scrollIntoView(config);
    }, 0);
  }
}
