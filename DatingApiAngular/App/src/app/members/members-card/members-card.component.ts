import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { faUser, faHeart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlrtifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.css']
})
export class MembersCardComponent implements OnInit {
  public faUser = faUser;
  public faHeart = faHeart;
  public faEnvelope = faEnvelope;

  @Input() public user: User
  public _user: User;
  constructor(private auth: AuthService, private userService: UserService, private alertify: AlrtifyService) { }

  ngOnInit(): void {
  }
  sendLike(id: number) {
    this.userService.sendlike(this.auth.UserName.nameid, id).subscribe(data => {
      this.alertify.success("liked successfully")
    }, err => { this.alertify.Error("Cant like") })

  }

}
