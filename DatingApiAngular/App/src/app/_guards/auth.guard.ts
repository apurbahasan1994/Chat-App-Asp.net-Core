import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlrtifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private alertify: AlrtifyService, private route: Router) { }
  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    }
    this.alertify.Error("you shall not passs");
    this.route.navigate(['/home']);
    return false;
  }

}
