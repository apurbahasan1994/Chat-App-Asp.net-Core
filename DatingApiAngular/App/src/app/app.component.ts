import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'App';
  constructor(private auth: AuthService, private jwtHelper: JwtHelperService) { }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token)
      this.auth.UserName = this.jwtHelper.decodeToken(token);
    if (user) {
      this.auth.currentUser = user;
      this.auth.changemenberPhoto(user.photoUrl);
    }
  }
}
