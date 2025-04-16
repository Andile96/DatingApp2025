import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Message } from '../_models/message';
import { TimeagoModule } from 'ngx-timeago';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule, PaginationModule,FormsModule,RouterLink,TimeagoModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messageService = inject(MessageService);
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
  getRoute(message: Message) {
    if (this.container === 'Outbox') return `/members/${message.recipientUsername}`;
    else return `/members/${message.senderUsername}`
  }
}