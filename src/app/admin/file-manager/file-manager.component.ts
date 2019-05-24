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

    // handleFileInput(file) {
    //     this.spinner.show();
    //     this.fileToUpload = file;
    //     if (file.type.substr(0, 5) === 'video') {
    //         this.service.addForPreview(file).toPromise().then(res => {
    //             this.getConvertedFile(file.name);
    //             this.spinner.hide();
    //         }).catch(error =>{  this.spinner.hide();  });
    //     }
    // }


    handleFileInput(file) {
        // this.showImagePreview(file);
        this.spinner.show();
        this.fileToUpload = file;
        if (file.type.substr(0, 5) === 'video') {
            this.service.addForPreview(file).subscribe(res => {
                this.getConvertedFile(file.name);
                this.spinner.hide();
            }, error => {
                if (error.status === 200) {
                    this.getConvertedFile(file.name);
                }
                this.spinner.hide();
            });
        } else {
            this.spinner.hide();
        }
    }

    getConvertedFile(filename) {
        this.spinner.show();
        // this.service.getForPreview(filename).subscribe(res => {

        this.service.getPriview(filename, 'PC').toPromise().then(res => {
            this.spinner.hide();
            this.showImagePreview(res['body']);
        }).catch(errorResponse => {
            this.notify.notify('warning', 'Unknown File Type or Currupted File');
            this.spinner.hide();
        });
    }
    changeMediaType(type) {
        this.mediaType = type;
        // this.imageUrl = null;
    }

    showImagePreview(file: Blob) {
        // Show image preview
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
        this.service.getImageLibrary().subscribe(res => {
            this.fileExplorer.images = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getAnimationLibrary() {

        this.spinner.show();
        this.service.getAnimationLibrary().subscribe(res => {
            // this.fileExplorer = [];
            this.fileExplorer.animations = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    uploadFile() {
        this.spinner.show();
        if (this.fileToUpload) {
            if (this.mediaType === 'image') {
                this.service.uploadImage(this.fileToUpload).subscribe(res => {
                    this.notify.notify('success', res.toString());
                    this.spinner.hide();
                    this.mediaType = (this.mediaType === 'image') ? 'video' : 'image';
                    this.getImageLibrary();
                    this.getAnimationLibrary();
                }, error => {
                    if (error.status === 200) {
                        this.notify.notify('success', error.error.text);
                        this.isPreviewVideo = false;
                        this.isPreviewObject = false;
                        this.isPreviewImage = false;
                        this.fileToUpload = null;
                        this.mediaType = (this.mediaType === 'image') ? 'video' : 'image';
                        this.getImageLibrary();
                        this.getAnimationLibrary();
                        this.spinner.hide();
                    } else {
                        this.notify.notify('error', 'Something went Wrong or Already Exist');
                        this.spinner.hide();
                    }
                });
            } else {
                this.service.uploadAnimation(this.fileToUpload).subscribe(res => {
                    this.notify.notify('success', res.toString());
                    this.spinner.hide();
                    this.getImageLibrary();
                    this.getAnimationLibrary();
                }, error => {
                    if (error.status === 200) {
                        this.notify.notify('success', error.error.text);
                        this.isPreviewVideo = false;
                        this.isPreviewObject = false;
                        this.isPreviewImage = false;
                        this.fileToUpload = null;
                        this.mediaType = (this.mediaType === 'image') ? 'video' : 'image';
                        this.spinner.hide();
                        this.getImageLibrary();
                        this.getAnimationLibrary();
                    } else {
                        this.notify.notify('error', 'Something went Wrong or Already Exist');
                        this.spinner.hide();
                    }
                });
            }

        } else {
            this.notify.notify('info', 'Select a file');
        }

        // this.service.uploadImage(this.fileToUpload).subscribe(res => {
        //   this.notify.notify('success', 'Uploaded Successfully');
        // }, error => {
        // });
    }

    getMimetype = (signature) => {
        switch (signature) {
            case '89504E47':
                return 'image/png';
            case '47494638':
                return 'image/gif';
            case 'FFD8FFDB':
            case 'FFD8FFE0':
            case 'FFD8FFE1':
                return 'image/jpeg';
            case '3C3F786D':
                return 'image/svg+xml';
            case '00018':
            case '0001C':
            case '00020':
                return 'video/mp4';
            case '1A45DFA3':
                return 'video/webm';
            case '4357539':
                return 'application/x-shockwave-flash';
            case '504B0304':
            case '504B34':
                return 'application/zip';
            case '25504446':
                return 'application/pdf';
            default:
                return 'Unknown filetype';
        }
    }
}
