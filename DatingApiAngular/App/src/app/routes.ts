import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ListComponent } from "./list/list.component";
import { MemberlistComponent } from "./memberlist/memberlist.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MembersDetailComponent } from "./members/members-detail/members-detail.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";
import { PreventUnsavedChanges } from "./_guards/prevent-unsaved-changes.guard";
import { ListResolver } from "./_resolvers/list.resolver";
import { MemberDetailResolver } from "./_resolvers/member-details.resolver";
import { MemberEditResolver } from "./_resolvers/member-edit.resolver";
import { MemberListResolver } from "./_resolvers/member-list.resolver";
import { MessageResolver } from "./_resolvers/message.resolver";

export const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "",
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: "memberList", component: MemberlistComponent, canActivate: [AuthGuard], resolve: { users: MemberListResolver } },
      { path: "members/:id", component: MembersDetailComponent, resolve: { user: MemberDetailResolver } },
      {
        path: 'member/edit', component: MemberEditComponent,
        resolve: { user: MemberEditResolver }, canDeactivate: [PreventUnsavedChanges]
      },
      { path: "list", component: ListComponent, resolve: { users: ListResolver } },

      { path: "message", component: MessagesComponent, resolve: { messages: MessageResolver } },

    ],
  },
  { path: "home", component: HomeComponent },
  { path: "**", redirectTo: "home", pathMatch: 'full' }

]
