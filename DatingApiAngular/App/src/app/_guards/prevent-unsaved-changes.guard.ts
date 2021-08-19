import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { MemberEditComponent } from "../members/member-edit/member-edit.component";

Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{
  canDeactivate(component: MemberEditComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (component.editForm.dirty) {
      return confirm("Are you sure to continue? any unsave chnageds will be lost!")
    }
    return true;
  }


}
