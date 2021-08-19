import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AlrtifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  constructor(private auth: AuthService, private userService: UserService, private alertify: AlrtifyService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages() {
    this.userService.getMessageThread(this.auth.UserName.nameid, this.recipientId)
      .pipe(tap(message => {
        for (let i = 0; i < this.messages.length; i++) {
          if (this.messages[i].isRead === false && this.messages[i].recipientId === this.auth.UserName.nameid) {
            this.userService.markAsRead(this.messages[i].id, this.auth.UserName.nameid);
          }

        }

      }))
      .subscribe(msg => {
        this.messages = msg;

      },
        error => {
          this.alertify.Error(error);
        })
  }
  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.auth.UserName.nameid, this.newMessage)
      .subscribe((message: Message) => {
        this.messages.unshift(message);
        console.log(message.content)
        this.newMessage.content = "";
      }, err => {
        this.alertify.Error(err)
      })

  }

}
