import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlrtifyService } from "../services/alertify.service";
import { UserService } from "../services/user.service";
import { User } from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<User>{
  constructor(private userService: UserService, private router: Router, private alertify: AlrtifyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(error => {
        console.log(error.message)
        this.alertify.Error("Problem retriving data");
        this.router.navigate(['/members'])
        return of(null)
      })
    )
  }

}
