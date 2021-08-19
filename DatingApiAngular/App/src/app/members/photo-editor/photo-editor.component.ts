import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { AlrtifyService } from 'src/app/services/alertify.service';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() public mainPhoto = new EventEmitter<Photo>();
  public faTrash = faTrash;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  baseURL = environment.apiUrl;
  faUpload = faUpload;
  currentMainPhoto: Photo;

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlrtifyService) {
  }

  ngOnInit(): void {
    this.initializeUploader();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  initializeUploader() {
    debugger;
    this.uploader = new FileUploader({
      url: this.baseURL + 'Cloudenary/AddUserPhoto/' + this.authService.UserName.nameid,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    };
  }

  setmainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.UserName.nameid, photo.id).subscribe(data => {
      this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.alertify.success("Updated Successfully");
      this.authService.changemenberPhoto(photo.url);
      //this.mainPhoto.emit(photo);
    }, err => {
      this.alertify.Error(err.message);
    })
  }
  deletePhoto(id: number) {
    this.alertify.confirm("do you want to delete this photo?", () => {
      this.userService.deletePhoto(this.authService.UserName.nameid, id).subscribe(data => {
        this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
        this.alertify.success("photo has been deleteted.")
      }, err => {
        this.alertify.Error(err.message);
      })
    });

  }
  // upload() {
  //   this.uploader.uploadAll();

  // }
}
