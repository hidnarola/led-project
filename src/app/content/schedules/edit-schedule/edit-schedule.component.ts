import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-edit-schedule',
    templateUrl: './edit-schedule.component.html',
    styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {
    oldScheduleName: string;
    ms24 = 86400000;
    durationList: any = [];
    myAnimationFile: boolean;
    myImageFile: boolean;
    animationLibraryFile: boolean;
    imageLibraryFile: boolean;
    myFile: boolean;
    rootFile: boolean;
    libraryFile: boolean;
    display = false;
    fileExplorer: any;
    fileNamesList: any = [];
    currentYear = Number(new Date().getFullYear());
    repeat = 'None';
    years = [];
    files = [];
    fileInfoStr: any = [];
    fileInfo: any = [];
    myfile: any;
    existFileToUpload: any[] = [];
    fileToUpload: any[] = [];
    filesToUpload: any[] = [];
    res: any;
    imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
    model: any = {};
    CONFIG = this.config;
    isPreviewImage: boolean;
    isPreviewObject: boolean;
    isPreviewVideo: boolean;
    videoType: string;
    year = new Date().getFullYear();
    userid: any;
    scheduleId: number;
    myMessageFile:boolean;
    msgList:any = [];

    constructor(
        private notifier: NotifierService,
        private route: ActivatedRoute,
        private service: SchedulesService,
        private router: Router,
        private config: Config,
        private sanitizer: DomSanitizer,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.model.myfiles = [];
        for (let i: any = new Date().getFullYear(); this.years.length < 100; i++) {
            this.years.push({ 'value': i });
        }
        this.route.params.subscribe(params => {
            this.scheduleId = params['id'] ;
            this.service.getScheduleById(params['id']).subscribe(res => {
                this.res = res;
                this.userid = this.res.scheduleDTO['userid'];
                this.repeat = this.res.type;
                this.model = this.res.scheduleDTO;
                this.files = this.res.multipartImages;
                this.files.forEach(file => {
                    this.fileInfoStr.push({ name: file.path, source: 'folder' });
                    this.fileNamesList.push(file.path);
                    this.existFileToUpload.push(file);
                });
                this.oldScheduleName = this.res.scheduleDTO.scheduleName;
                // Set Date to datepicker
                let year = this.model.startDate.year;
                let month = ('0' + this.model.startDate.monthValue).slice(-2);
                let date = ('0' + this.model.startDate.dayOfMonth).slice(-2);
                this.model.startDate = year + '-' + month + '-' + date;
                year = this.model.endDate.year;
                month = ('0' + this.model.endDate.monthValue).slice(-2);
                date = ('0' + this.model.endDate.dayOfMonth).slice(-2);
                this.model.endDate = year + '-' + month + '-' + date;
                // Set Time to Time Picker
                let HH = ('0' + this.model.startTime.hour).slice(-2);
                let MM = ('0' + this.model.startTime.minute).slice(-2);
                this.model.startTime = HH + ':' + MM;
                HH = ('0' + this.model.endTime.hour).slice(-2);
                MM = ('0' + this.model.endTime.minute).slice(-2);
                this.model.endTime = HH + ':' + MM;
                if (this.repeat === this.CONFIG.SCHE_WEEK || this.repeat === this.CONFIG.SCHE_MONT) {
                    if (this.model.weekDays.length > 0) {
                        this.model.weekDays = this.model.weekDays.toString().split(',');
                        this.model.monthorweek = 'week';
                    } else {
                        this.model.monthorweek = 'month';
                    }
                    if (this.repeat === this.CONFIG.SCHE_MONT) {
                        this.model.scheduleMonths = this.model.scheduleMonths.toString().split(',');
                    }
                } else if (this.repeat === this.CONFIG.SCHE_YEAR) {
                    const now = new Date();
                    now.setDate(this.model.scheduleMonthDays);
                    now.setMonth(this.model.scheduleMonths[0]);
                    this.model.onDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) +
                        '-' + ('0' + (now.getDate())).slice(-2);
                }
                this.model.duration = this.msToTime(this.model.duration);
                this.spinner.hide();
            }, error => {
                this.notifier.notify('error', error.error.message);
                this.spinner.hide();
                this.router.navigate(['/user/schedules']);
            });
        });
    }

    myFolder_click() {
        this.myFile = true;
        this.rootFile = false;
        this.myImageFile = false;
        this.myMessageFile = false ;
        this.myAnimationFile = false;
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
    }
    rootFiles() {
        this.rootFile = true;
        this.libraryFile = false;
        this.myFile = false;
        this.myMessageFile = false ;
        this.imageLibraryFile = false;
        this.animationLibraryFile = false;
        this.myImageFile = false;
        this.myAnimationFile = false;
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

    myMessage(){
        this.myFile = false;
        this.myMessageFile = true ;
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

    getMyMessage() {
        this.myMessage();
        this.spinner.show();
        this.service.getMyMessage().toPromise().then(res => {
            this.spinner.hide();
            this.msgList = [];
            this.msgList = res ;
        }).catch(error => {
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

    pickFile(file, filename, source) {
        if (this.fileNamesList && this.fileNamesList.indexOf(file.name) >= 0 ||
            this.files && this.files.indexOf(file.name) >= 0 || this.fileToUpload && this.filesToUpload.indexOf(file.name) >= 0) {
            this.notifier.notify('warning', 'Same File Name Exist.');
            this.spinner.hide();
        } else {
            this.spinner.show();
            this.service.getImageFromUrl(file).subscribe(res => {
                const newFile = this.service.blobToFile(res['body'], filename);
                this.spinner.hide();
                this.handleFileInput(newFile, source);
                this.display = false;
            }, error => {
                this.spinner.hide();
                this.display = false;
            });
        }
    }

    handleFileInput(file, source) {
        if (file) {
            this.spinner.show();
            if (this.fileNamesList && this.fileNamesList.indexOf(file.name) >= 0 ||
                this.files && this.files.indexOf(file.name) >= 0 || this.fileToUpload && this.filesToUpload.indexOf(file.name) >= 0) {
                this.notifier.notify('warning', 'Same File Name Exist.');
                this.spinner.hide();
            } else {
                file.duration = '00:00:06';
                this.fileToUpload.push(file);
                this.fileNamesList.push(file.name);
                if (file.type.substr(0, 5) === 'video' && source === 'PC') {
                    this.service.addForPreview(file).subscribe(res => {
                        this.spinner.hide();
                    }, error => {
                        this.spinner.hide();
                    });
                } else {
                    this.spinner.hide();
                }
                this.fileInfo.push({ 'name': file.name, 'source': source });
            }
        }
        this.display = false;
        if (source === 'PC') {
            document.getElementById('myfile')['value'] = '';
        }
    }
    imagePreview(filename) {
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = false;
        this.spinner.show();
        this.service.getImageForPreview(filename, localStorage.getItem('userid')).subscribe(res => {
            this.spinner.hide();
            this.showImagePreview(res['body']);
        }, error => {
            this.notifier.notify('error', error.error.message);
            this.spinner.hide();
        });
    }

    getConvertedFile(filename) {
        let source;
        this.fileInfo.forEach(file => {
            if (filename === file.name) {
                source = file.source;
            }
        });
        this.service.getPriview(filename, source).toPromise().then(res => {
            this.spinner.hide();
            this.showImagePreview(res['body']);
        }).catch(errorResponse => {
            this.spinner.hide();
        });
    }
    showImagePreview(file: Blob) {
        this.spinner.show();
        this.isPreviewVideo = false;
        // Show image preview
        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
            if (file.type.substr(0, 5) === 'video') {
                this.isPreviewImage = false;
                this.isPreviewObject = false;
                this.isPreviewVideo = true;
                this.videoType = file.type;
            } else if (file.type.substr(0, 5) === 'image') {
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

    deleteImage(index , fileName) {
        this.fileToUpload.splice(index, 1);
        const i = this.fileNamesList.indexOf(fileName);
        this.fileNamesList.splice(i, 1);
        this.fileInfo.splice(index, 1);
        this.existFileToUpload.splice(index,1); //
        this.isPreviewImage = false;
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
        this.myfile = '';
    }
    edeleteImage(index) {
        this.files.splice(index, 1);
        this.fileToUpload.splice(index, 1);
        this.fileInfoStr.splice(index, 1);
        this.fileNamesList.splice(index, 1);
        this.isPreviewImage = false;
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
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
        if (this.model.monthorweek === 'week') {
            this.model.scheduleMonthDays = 0;
        } else {
            this.model.weekDays = [];
        }
        this.durationList = [];
        this.fileToUpload.forEach(file => {
            const dura: any = {};
            dura.name = file.name;
            dura.regex = this.timeToMS(file.duration);
            this.durationList.push(dura);
        });
        this.existFileToUpload.forEach(file => {
            const dura: any = {};
            dura.name = file.path;
            dura.regex = file.duration ? file.duration : 6000;
            this.durationList.push(dura);
        });
        this.fileInfo.forEach(file => {
            this.fileInfoStr.push({ 'name': file.name, 'source': file.source });
        });
        this.model.scheduleId = +this.scheduleId ;
        this.model.durationList = this.durationList;
        this.model.oldScheduleName = this.oldScheduleName;
        this.uniqueArray(this.fileInfoStr);
        this.model.fileInfo = this.fileInfoStr;
        this.model.userid = this.userid;
        this.service.updateSChedule(this.model, this.fileToUpload, this.repeat).toPromise().then(res => {
            this.model = {};
            this.fileToUpload = [];
            this.spinner.hide();
            this.notifier.notify('success', 'Scheduled Updated Successfully');
            this.router.navigate(['/user/schedules']);
        }).catch(error => {
            if (error.status === 400) {
                this.notifier.notify('warning', 'Select Image To upload');
            } else {
                this.notifier.notify('error', error.error.message);
            }
            this.spinner.hide();
        });

    }
    uniqueArray = (values) => values.filter((v, i) => values.indexOf(v) === i);
    convertToDate(day, mon, yr) {
        const date = new Date();
        date.setFullYear(yr, mon, day);
        return date;
    }

    convertToTime(HH, MM, SS) {
        const time = new Date();
        time.setHours(HH, MM, SS);
        return time;
    }
    pad(n, width) {
        const z = '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    msToTime(s) {
        if (s) {
            const ms = s % 1000;
            s = (s - ms) / 1000;
            const secs = s % 60;
            s = (s - secs) / 60;
            const mins = s % 60;
            const hrs = (s - mins) / 60;

            return this.pad(hrs, 2) + ':' + this.pad(mins, 2) + ':' + this.pad(secs, 2);
        } else {
            return '';
        }
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
