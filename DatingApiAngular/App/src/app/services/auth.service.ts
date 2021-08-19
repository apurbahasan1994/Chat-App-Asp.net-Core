import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators"
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

Map

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + "Auth"
  jwthelper = new JwtHelperService();
  UserName: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.webp')
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(private http: HttpClient) { }
  changemenberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  login(model: any) {
    return this.http.post(this.baseUrl + '/' + "login", model)
      .pipe(

        map((response: any) => {
          const user = response;
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.UserName = this.jwthelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changemenberPhoto(this.currentUser.photoUrl);
          console.log(localStorage.getItem('token'))
        })

      )
  }
  register(model: any) {
    debugger;
    return this.http.post(this.baseUrl + "/" + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwthelper.isTokenExpired(token);
  }
}
