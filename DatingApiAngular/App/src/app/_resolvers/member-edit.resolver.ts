import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlrtifyService } from "../services/alertify.service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { User } from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class MemberEditResolver implements Resolve<User>{
  constructor(private userService: UserService, private router: Router, private alertify: AlrtifyService, private authService: AuthService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.userService.getUser(this.authService.UserName.nameid).pipe(
      catchError(error => {
        console.log(error.message)
        this.alertify.Error("Problem retriving data");
        this.router.navigate(['/members'])
        return of(null)
      })
    )
  }

}
