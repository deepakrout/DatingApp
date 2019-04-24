import { Component, OnInit, Input } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Photo } from '../../_models/photo';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;


  constructor(private authService: AuthService) { }

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
  }


}
