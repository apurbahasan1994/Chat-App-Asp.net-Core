import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlrtifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Message } from '../_models/message';
import { PaginatedResult, Pagination } from '../_models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = "Unread";
  constructor(private authService: AuthService, private userService: UserService, private alertify: AlrtifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.messages = data["messages"].results;
      this.pagination = data["messages"].pagination;
    })

  }
  loadMessages() {
    this.userService.getMessages(this.authService.UserName.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((data: PaginatedResult<Message[]>) => {
        debugger;
        this.messages = data.results;
        this.pagination = data.pagination;
      },
        err => {
          this.alertify.Error(err);
        })
  }
  pageChanged(event: any) {
    this.pagination.currentPage = event.currentPage;
    this.loadMessages();

  }
  deleteMessage(id: number) {
    this.userService.deleteMessages(id, this.authService.UserName.nameid)
      .subscribe(data => {
      }, err => {
        this.alertify.Error(err.message);
      }, () => {
        this.loadMessages()
      })
  }

}
