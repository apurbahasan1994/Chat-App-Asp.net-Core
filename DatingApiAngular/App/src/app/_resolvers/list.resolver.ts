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
export class ListResolver implements Resolve<User[]>{
  pageNumber = 1;
  pageSize = 5;
  likeParam = 'Likers';
  constructor(private userService: UserService, private router: Router, private alertify: AlrtifyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likeParam)
      .pipe(
        catchError(error => {
          this.alertify.Error("Problem retriving data");
          this.router.navigate(['/home'])
          return of(null)
        })
      )
  }

}
