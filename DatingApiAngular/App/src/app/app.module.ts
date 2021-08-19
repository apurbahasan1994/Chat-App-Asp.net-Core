import { NgModule, Pipe } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AlrtifyService } from './services/alertify.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { UserService } from './services/user.service';
import { MembersCardComponent } from './members/members-card/members-card.component';
import { MembersDetailComponent } from './members/members-detail/members-detail.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberDetailResolver } from './_resolvers/member-details.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimeAgoExtendPipe } from './_pipes/time-ago-extend.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ListResolver } from './_resolvers/list.resolver';
import { MessageResolver } from './_resolvers/message.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
export function tokenGetter() {
  return localStorage.getItem("token");
}

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  }
}
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberlistComponent,
    ListComponent,
    MessagesComponent,
    MembersCardComponent,
    MembersDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TimeAgoExtendPipe,
    MemberMessagesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    HttpClientModule,
    TabsModule,
    NgxGalleryModule,
    FontAwesomeModule,
    FileUploadModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    JwtModule.forRoot({

      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["http://localhost:31199/"],
        disallowedRoutes: ["http://localhost:31199/api/Auth"]
      }

    }
    )

  ],
  providers: [
    AuthService,
    AlrtifyService,
    JwtHelperService,
    UserService,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    PreventUnsavedChanges,
    ListResolver,
    MessageResolver,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
