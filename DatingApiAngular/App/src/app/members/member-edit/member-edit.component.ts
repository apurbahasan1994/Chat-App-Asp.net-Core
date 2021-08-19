import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlrtifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['event'])
  photoUrl: string;
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  user: User;
  constructor(private route: ActivatedRoute, private userservice: UserService, private authservice: AuthService, private alertify: AlrtifyService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    })
    this.authservice.currentPhotoUrl.subscribe(photUrl => this.photoUrl = photUrl)
    console.log(this.user);
  }
  updateUser() {
    console.log(this.user);
    this.userservice.updateUser(this.authservice.UserName.nameid, this.user).subscribe(data => {
      this.alertify.success("Update Performed successfully");
      this.editForm.reset(this.user);
    }, err => {
      this.alertify.Error(err.message);
    });
  }
  // mainPhoto(event: Photo) {
  //   this.user.photoUrl = event.url;
  // }

}
