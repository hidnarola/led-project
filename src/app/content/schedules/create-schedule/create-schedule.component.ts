import { Component, OnInit } from '@angular/core';
import { Config } from '../../../shared/config';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SchedulesService } from '../../../shared/schedules.service';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
@Component({
    selector: 'app-create-schedule',
    templateUrl: './create-schedule.component.html',
    styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
    // ms24 = 86400000;
    durationList: any = [];
    myAnimationFile: boolean;
    myImageFile: boolean;
    animationLibraryFile: boolean;
    imageLibraryFile: boolean;
    myFile: boolean;
    rootFile: boolean;
    libraryFile: boolean;
    display = false;
    repeat = 'None';
    currentYear = Number(new Date().getFullYear());
    myfile: any;
    fileToUpload: any[] = [];
    filesToUpload: any = [];
    fileInfo: any = [];
    imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
    isPreviewImage: boolean;
    isPreviewVideo: boolean;
    isPreviewObject: boolean;
    videoType: string;
    model: any = {};
    CONFIG = this.config;
    // user_name: string;
    // user_role: string;
    uploads = [];
    date = new Date();
    fileExplorer: any;
    fileNamesList: any = [];
    searchText = '';

    constructor(
        private notifier: NotifierService,
        private route: ActivatedRoute,
        private config: Config,
        private service: SchedulesService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.model.priority = 1;
        this.model.scheduleName = 'NewSchedule';
        this.model.startDate = moment().format('YYYY-MM-DD');
        this.model.startTime = this.date.toTimeString().slice(0, 5);
        this.model.firstYear = this.date.getFullYear();
        this.model.lastYear = Number(this.date.getFullYear() + 1);
        this.model.endDate = moment().add(1, 'year').endOf('year').format('YYYY-MM-DD');
        this.model.endTime = '23:59';
        this.model.monthorweek = 'week';
        this.model.moduloYDay = '1';
        this.model.moduloWeek = '1';
        this.model.duration = '00:00:06';
        this.model.scheduleMonthDays = null;
        this.model.onDate = moment().startOf('year').format('YYYY-MM-DD');
        this.model.myfiles = [];

        this.route.queryParams.filter(params => params.repeat).subscribe(params => {
            this.repeat = params.repeat;
        });
    }

    myFolder_click() {
        this.myFile = true;
        this.rootFile = false;
        this.myImageFile = false;
        this.myAnimationFile = false;
        this.searchText = '';
    }
    showDialog() {
        this.display = true;
        this.rootFiles();
    }
    myLibrary_click() {
        this.libraryFile = true;
        this.rootFile = false;
        this.imageLibraryFile = false;
        this.animationLibraryFile = false;
        this.searchText = '';
    }
    rootFiles() {
        this.rootFile = true;
        this.libraryFile = false;
        this.myFile = false;
        this.imageLibraryFile = false;
        this.animationLibraryFile = false;
        this.myImageFile = false;
        this.myAnimationFile = false;
        this.searchText = '';
    }
    ImageLibrary() {
        this.libraryFile = false;
        this.imageLibraryFile = true;
    }
    AnimationLibrary() {
        this.libraryFile = false;
        this.animationLibraryFile = true;
    }
    myImage() {
        this.myFile = false;
        this.myImageFile = true;
    }
    myAnimation() {
        this.myFile = false;
        this.myAnimationFile = true;
    }

    getMyImagesLibrary() {
        this.myImage();
        this.spinner.show();
        this.service.getMyImages(localStorage.getItem('userid')).subscribe(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getMyAnimationLibrary() {
        this.myAnimation();
        this.spinner.show();
        this.service.getMyAnimations(localStorage.getItem('userid')).subscribe(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getImageLibrary() {
        this.ImageLibrary();
        this.spinner.show();
        this.service.getImageLibrary().subscribe(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getAnimationLibrary() {
        this.AnimationLibrary();
        this.spinner.show();
        this.service.getAnimationLibrary().subscribe(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    pickFile(fileURL, filename, source) {
        this.spinner.show();
        this.service.getImageFromUrl(fileURL).toPromise().then(res => {
            const newFile = this.service.blobToFile(res['body'], filename);
            this.spinner.hide();
            this.handleFileInput(newFile, source);
            this.display = false;
        }).catch(error => {
            // this.notifier.notify('error', 'Something went wrong.');
        });
    }

    dataURItoBlob(dataURI) {
        const byteString = atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        return blob;
    }

    handleFileInput(file, source) {
        if (file) {
            this.spinner.show();
            if (this.fileNamesList.indexOf(file.name) >= 0) {
                this.notifier.notify('warning', 'Same File Name Exist.');
                this.spinner.hide();
            } else {
                file.duration = '00:00:06';
                this.fileToUpload.push(file);
                this.fileInfo.push({ 'name': file.name, 'source': source });
                this.fileNamesList.push(file.name);
                this.display = false;
                if (file.type.substr(0, 5) === 'video' && source === 'PC') {
                    this.service.addForPreview(file).subscribe(res => {
                        this.spinner.hide();
                    }, error => {
                        this.spinner.hide();
                    });
                } else {
                    this.spinner.hide();
                }
                document.getElementById('file')['value'] = '';
            }
        }
        this.display = false;
    }

    getConvertedFile(filename, index) {
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = false;
        this.spinner.show();
        this.service.getPriview(filename, this.fileInfo[index].source).toPromise().then(res => {
            this.spinner.hide();
            this.showImagePreview(res['body']);
        }).catch(errorResponse => {
            this.spinner.hide();
        });
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

    deleteImage(index) {
        this.fileToUpload.splice(index, 1);
        this.fileNamesList.splice(index, 1);
        this.fileInfo.splice(index, 1);
        this.isPreviewImage = false;
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
        this.myfile = '';
    }
    timeToMS(strtime) {
        let ms = 0;
        const HH = strtime.split(':')[0] * 60 * 60 * 1000;
        const mm = strtime.split(':')[1] * 60 * 1000;
        const ss = strtime.split(':')[2] * 1000;
        ms = HH + mm + ss;
        return ms;
    }
    onSubmit() {
        this.spinner.show();
        this.durationList = [];
        this.fileToUpload.forEach(file => {
            const dura: any = {};
            dura.name = file.name;
            dura.regex = this.timeToMS(file.duration);
            this.durationList.push(dura);
        });
        this.model.durationList = this.durationList;
        this.model.fileInfo = this.fileInfo;
        this.service.createSchedule(this.model, this.fileToUpload, this.repeat).toPromise().then(res => {
            this.notifier.notify('success', 'Scheduled Stored Successfully');
            this.model = {};
            this.fileToUpload = [];
            this.spinner.hide();
            this.router.navigate(['/user/schedules']);
        }).catch(error => {
            if (error.status === 500) {
                this.notifier.notify('error', error.error.message);
            } else if (error.status === 400) {
                this.notifier.notify('warning', 'Select File To upload');
            } else {
                this.notifier.notify('error', error.error);
            }
            this.spinner.hide();
        });
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
