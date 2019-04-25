import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Photo } from '../../_models/photo';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChanged = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;


  constructor(private authService: AuthService,
              private userSerice: UserService,
              private alrtify: AlertifyService) { }

  ngOnInit() {
    this.initilizeUploader();
  }

  public fileOverBase( e: any ): void {
    this.hasBaseDropZoneOver = e;
  }

  initilizeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, ststus, header) => {
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

  setMainPhoto(photo: Photo) {
    this.userSerice.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      console.log(`Success set to main`);
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.getMemberPhotoChanged.emit(photo.url);
    }, error => {
      this.alrtify.error(error);
    });
  }

}
