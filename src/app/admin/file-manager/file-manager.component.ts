import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { SchedulesService } from 'src/app/shared/schedules.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {
  mediaType: string;
  imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
  myfile: any;
  isPreviewImage: boolean;
  isPreviewObject: boolean;
  isPreviewVideo: boolean;
  videoType: string;
  fileToUpload: File;
  fileExplorer: any;
  constructor(private spinner: NgxSpinnerService, private sanitizer: DomSanitizer,
    private service: SchedulesService, private notify: NotifierService) { }

  ngOnInit() {
    this.mediaType = 'image';
    this.fileExplorer = [];
    this.getAnimationLibrary();
    this.getImageLibrary();
  }
  handleFileInput(file) {
    this.showImagePreview(file);
    this.fileToUpload = file;
  }
  changeMediaType(type) {
    this.mediaType = type;
    // this.imageUrl = null;
  }
  showImagePreview(file: File) {
    // Show image preview
    this.spinner.show();
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
      if ((this.imageUrl.toString().substr(this.imageUrl.toString().indexOf('data'), 10) === 'data:video')) {
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = true;
        this.videoType = file.type;
        // console.log('video file selected');
      } else if ((this.imageUrl.toString().substr(this.imageUrl.toString().indexOf('data'), 10) === 'data:image')) {
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
        this.isPreviewImage = true;
      } else {
        // const blob = this.b64toBlob((event.target.result)
        //   .replace('data:application/x-shockwave-flash;base64,', ''), 'application/x-shockwave-flash');
        // const blobUrl = URL.createObjectURL(blob);
        // this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        this.isPreviewVideo = false;
        this.isPreviewImage = false;
        this.isPreviewObject = true;
        // console.log('Animation File Found');
      }
      this.spinner.hide();
    };
    reader.readAsDataURL(file);
    // console.log(this.imageUrl);
  }

  getImageLibrary() {

    this.spinner.show();
    this.service.getImageLibrary().subscribe(res => {
      // this.fileExplorer = [];
      this.fileExplorer.images = res;
      // console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getAnimationLibrary() {

    this.spinner.show();
    this.service.getAnimationLibrary().subscribe(res => {
      // this.fileExplorer = [];
      this.fileExplorer.animations = res;
      console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  uploadFile() {
    // console.log('fileToUpload => ', this.fileToUpload);
    if (this.fileToUpload) {
      if (this.mediaType === 'image') {
        this.service.uploadImage(this.fileToUpload).subscribe(res => {
          this.notify.notify('success', res.toString());
        }, error => {
          console.log(error);
          if (error.status === 200) {
            this.notify.notify('success', error.error.text);
            this.isPreviewVideo = false;
            this.isPreviewObject = false;
            this.isPreviewImage = false;
            this.fileToUpload = null;
          } else {
            this.notify.notify('error', 'Something went Wrong or Already Exist');
          }
        });
      } else {
        this.service.uploadAnimation(this.fileToUpload).subscribe(res => {
          this.notify.notify('success', res.toString());
        }, error => {
          console.log(error);
          if (error.status === 200) {
            this.notify.notify('success', error.error.text);
            this.isPreviewVideo = false;
            this.isPreviewObject = false;
            this.isPreviewImage = false;
            this.fileToUpload = null;
          } else {
            this.notify.notify('error', 'Something went Wrong or Already Exist');
          }
        });
      }
      this.getImageLibrary();
      this.getAnimationLibrary();
    } else {
      this.notify.notify('info', 'Select a file');
    }

    // this.service.uploadImage(this.fileToUpload).subscribe(res => {
    //   this.notify.notify('success', 'Uploaded Successfully');
    // }, error => {
    //   console.log(error);
    // });
  }
}
