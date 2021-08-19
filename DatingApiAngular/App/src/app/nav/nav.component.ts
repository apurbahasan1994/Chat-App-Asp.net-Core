import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlrtifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authservice: AuthService, private alertify: AlrtifyService, private router: Router) { }

  ngOnInit(): void {
    this.authservice.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl)
  }

  login() {

    this.authservice.login(this.model).subscribe(next => {
      this.alertify.success("Login Succesfully");

    },
      error => {
        this.alertify.Error("Login Failed");
      },
      () => {
        this.router.navigate(['/memberList'])
      }
    )

  }
  loggedIn() {
    return this.authservice.loggedIn();
  }
  loggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authservice.currentUser = null;
    this.authservice.UserName = null;
    this.alertify.success("logeed out successfully");
    this.router.navigate(['/home']);
  }
}
