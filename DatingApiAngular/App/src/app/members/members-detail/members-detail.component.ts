import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AlrtifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models/user';
import { TimeAgoExtendPipe } from 'src/app/_pipes/time-ago-extend.pipe';
@Component({
  selector: 'app-members-detail',
  templateUrl: './members-detail.component.html',
  styleUrls: ['./members-detail.component.css']
})
export class MembersDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent
  user: User;
  tab: number;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];

  constructor(private auth: AuthService, private userService: UserService, private alertify: AlrtifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.route.queryParams.subscribe((params) => {
      this.tab = params['tab']
      this.memberTabs.tabs[this.tab > 0 ? this.tab : 0].active = true;
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }
  sendLike(id: number) {
    this.userService.sendlike(this.auth.UserName.nameid, id).subscribe(data => {
      this.alertify.success("liked successfully")
    }, err => { this.alertify.Error("Cant like") })

  }
  selectTab(tabId: number) {
    console.log(tabId)
    this.memberTabs.tabs[tabId].active = true;
  }

}
