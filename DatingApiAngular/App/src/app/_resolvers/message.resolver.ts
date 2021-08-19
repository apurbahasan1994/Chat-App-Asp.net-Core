import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlrtifyService } from "../services/alertify.service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Message } from "../_models/message";
import { User } from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class MessageResolver implements Resolve<Message[]>{
  pageNumber = 1;
  pageSize = 5;
  messageContainer = "Unread"
  constructor(private userService: UserService, private router: Router, private alertify: AlrtifyService, private auth: AuthService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getMessages(this.auth.UserName.nameid, this.pageNumber, this.pageSize, this.messageContainer)
      .pipe(
        catchError(error => {
          this.alertify.Error("Problem retriving messages");
          this.router.navigate(['/home'])
          return of(null)
        })
      )
  }

}
