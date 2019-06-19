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

    constructor(
        private spinner: NgxSpinnerService,
        private sanitizer: DomSanitizer,
        private service: SchedulesService,
        private notify: NotifierService
    ) { }

    ngOnInit() {
        this.mediaType = 'image';
        this.fileExplorer = [];
        this.getAnimationLibrary();
        this.getImageLibrary();
    }

    handleFileInput(file) {
        if (file) {
            this.spinner.show();
            let imageList = Object.keys(this.fileExplorer.images);
            let videoList = Object.keys(this.fileExplorer.animations);

            if (imageList && imageList.indexOf(file.name) >= 0 ||
                videoList && videoList.indexOf(file.name) >= 0) {
                this.notify.notify('warning', 'Same File Name Exist.');
                this.mediaType === 'image' ? document.getElementById('file')['value'] = '' : document.getElementById('mFile')['value'] = '';
            } else {
                this.fileToUpload = file;
                if (file.type.substr(0, 5) === 'video') {
                    this.service.addForPreview(file).toPromise().then(res => {
                        this.getConvertedFile(file.name);
                    }).catch(error => { this.spinner.hide(); });
                }
            }
        }
        this.spinner.hide();
    }

    getConvertedFile(filename) {
        this.spinner.show();
        this.service.getPriview(filename, 'PC').toPromise().then(res => {
            this.showImagePreview(res['body']);
            this.spinner.hide();
        }).catch(errorResponse => {
            this.notify.notify('warning', 'Unknown File Type or Currupted File');
            this.spinner.hide();
        });
    }

    changeMediaType(type) {
        this.mediaType = type;
    }

    showImagePreview(file: Blob) {
        this.spinner.show();
        this.isPreviewVideo = false;
        this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(null);
        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            if ((this.imageUrl.toString().substr(this.imageUrl.toString().indexOf('data'), 10) === 'data:video')) {
                this.isPreviewImage = false;
                this.isPreviewObject = false;
                this.isPreviewVideo = true;
                this.videoType = file.type;
            } else if ((this.imageUrl.toString().substr(this.imageUrl.toString().indexOf('data'), 10) === 'data:image')) {
                this.isPreviewVideo = false;
                this.isPreviewObject = false;
                this.isPreviewImage = true;
            } else {
                this.isPreviewVideo = false;
                this.isPreviewImage = false;
                this.isPreviewObject = true;
            }
            this.spinner.hide();
        };
        reader.readAsDataURL(file);
    }

    getImageLibrary() {
        this.spinner.show();
        this.service.getImageLibrary().toPromise().then(res => {
            this.fileExplorer.images = res;
            this.spinner.hide();
        }).catch(err => {
            this.spinner.hide();
        });
    }

    getAnimationLibrary() {
        this.spinner.show();
        this.service.getAnimationLibrary().toPromise().then(res => {
            this.fileExplorer.animations = res;
            this.spinner.hide();
        }).catch(err => {
            this.spinner.hide();
        });
    }

    uploadFile() {
        this.spinner.show();
        if (this.fileToUpload) {
            if (this.mediaType === 'image') {
                if (this.fileToUpload.type.substring(0, this.fileToUpload.type.lastIndexOf('/') + 1) === 'image/') {
                    this.service.uploadImage(this.fileToUpload).toPromise().then(res => {
                        this.isPreviewVideo = false;
                        this.isPreviewObject = false;
                        this.isPreviewImage = false;
                        this.fileToUpload = null;
                        this.mediaType = (this.mediaType === 'image') ? 'video' : 'image';
                        this.getImageLibrary();
                        this.getAnimationLibrary();
                        this.spinner.hide();
                        this.notify.notify('success', res['message']);
                    }).catch(error => {
                        if (error.status === 417) {
                            this.notify.notify('error', error.error.message);
                        } else {
                            this.notify.notify('error', 'Something went Wrong or Already Exist');
                        }
                        this.spinner.hide();
                    });
                } else {
                    this.notify.notify('error', 'Select Image file.');
                    this.spinner.hide();
                }
            } else {
                if (this.fileToUpload.type.substring(0, this.fileToUpload.type.lastIndexOf('/') + 1) === 'video/') {
                    this.service.uploadAnimation(this.fileToUpload).toPromise().then(res => {
                        this.isPreviewVideo = false;
                        this.isPreviewObject = false;
                        this.isPreviewImage = false;
                        this.fileToUpload = null;
                        this.mediaType = (this.mediaType === 'image') ? 'video' : 'image';
                        this.getImageLibrary();
                        this.getAnimationLibrary();
                        this.spinner.hide();
                        this.notify.notify('success', res['message']);
                    }).catch(error => {
                        if (error.status === 417) {
                            this.notify.notify('error', error.error.toString());
                        } else {
                            this.notify.notify('error', 'Something went Wrong or Already Exist');
                        }
                        this.spinner.hide();
                    });
                } else {
                    this.notify.notify('error', 'Select Animation file');
                    this.spinner.hide();
                }
            }
        } else {
            this.notify.notify('info', 'Select a file');
            this.spinner.hide();
        }
    }
}
