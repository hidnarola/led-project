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

    currentYear = Number(new Date().getFullYear());
    date = new Date();
    CONFIG = this.config;
    durationList: any = [];
    fileToUpload: any[] = [];
    filesToUpload: any = [];
    fileInfo: any = [];
    msgList: any = [];
    model: any = {};
    uploads = [];
    fileNamesList: any = [];
    videoType: string;
    myfile: any;
    fileExplorer: any;
    searchText = '';
    repeat = 'None';
    imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');

    myMessageFile: boolean;
    isPreviewImage: boolean;
    isPreviewVideo: boolean;
    isPreviewObject: boolean;
    myAnimationFile: boolean;
    myImageFile: boolean;
    animationLibraryFile: boolean;
    imageLibraryFile: boolean;
    myFile: boolean;
    rootFile: boolean;
    libraryFile: boolean;
    display = false;

    scheduleId: number;
    files = [];
    fileInfoStr: any = [];
    oldScheduleName: string;
    res: any;
    userid: any;
    existFileToUpload: any = [];

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

        this.route.params.subscribe(params => {
            this.scheduleId = params['id'];
            if (this.scheduleId) {
                this.service.getScheduleById(params['id']).toPromise().then(res => {
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
                }).catch(error => {
                    this.notifier.notify('error', error.error.message);
                    this.spinner.hide();
                    this.router.navigate(['/user/schedules']);
                });
            } else {
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
        });
    }

    myFolder_click() {
        this.myFile = true;
        this.rootFile = false;
        this.myImageFile = false;
        this.myAnimationFile = false;
        this.myMessageFile = false;
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
        this.myMessageFile = false;
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
    myMessage() {
        this.myFile = false;
        this.myMessageFile = true;
    }
    getMyImagesLibrary() {
        this.myImage();
        this.spinner.show();
        this.service.getMyImages(localStorage.getItem('userid')).toPromise().then(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }).catch(error => {
            this.spinner.hide();
        });
    }

    getMyAnimationLibrary() {
        this.myAnimation();
        this.spinner.show();
        this.service.getMyAnimations(localStorage.getItem('userid')).toPromise().then(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }).catch(error => {
            this.spinner.hide();
        });
    }

    getMyMessage() {
        this.myMessage();
        this.spinner.show();
        this.service.getMyMessage().toPromise().then(res => {
            this.spinner.hide();
            this.msgList = [];
            this.msgList = res;
        }).catch(error => {
            this.spinner.hide();
        });
    }

    getImageLibrary() {
        this.ImageLibrary();
        this.spinner.show();
        this.service.getImageLibrary().toPromise().then(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }).then(error => {
            this.spinner.hide();
        });
    }

    getAnimationLibrary() {
        this.AnimationLibrary();
        this.spinner.show();
        this.service.getAnimationLibrary().toPromise().then(res => {
            this.fileExplorer = [];
            this.fileExplorer = res;
            this.spinner.hide();
        }).then(error => {
            this.spinner.hide();
        });
    }

    uniqueArray = (values) => values.filter((v, i) => values.indexOf(v) === i);

    msToTime(s) {
        if (s) {
            const ms = s % 1000;
            s = (s - ms) / 1000;
            const secs = s % 60;
            s = (s - secs) / 60;
            const mins = s % 60;
            const hrs = (s - mins) / 60;
            return this.service.pad(hrs, 2) + ':' + this.service.pad(mins, 2) + ':' + this.service.pad(secs, 2);
        } else {
            return '';
        }
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

    imagePreview(filename) {
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = false;
        this.spinner.show();
        this.service.getImageForPreview(filename, localStorage.getItem('userid')).toPromise().then(res => {
            this.spinner.hide();
            this.showImagePreview(res['body']);
        }).catch(error => {
            this.notifier.notify('error', error.error.message);
            this.spinner.hide();
        });
    }

    deleteImage(index, fileName) {
        this.fileToUpload.splice(index, 1);
        const i = this.fileNamesList.indexOf(fileName);
        this.fileNamesList.splice(i, 1);
        this.fileInfo.splice(index, 1);
        this.existFileToUpload.splice(index, 1);
        this.isPreviewImage = false;
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
        this.myfile = '';
    }

    pickFile(fileURL, filename, source) {
        if (this.fileNamesList && this.fileNamesList.indexOf(fileURL) >= 0 ||
            this.files && this.files.indexOf(fileURL) >= 0 ||
            this.fileToUpload && this.filesToUpload.indexOf(fileURL) >= 0) {
            this.notifier.notify('warning', 'Same File Name Exist.');
            this.spinner.hide();
        } else {
            this.spinner.show();
            this.service.getImageFromUrl(fileURL).toPromise().then(res => {
                const newFile = this.service.blobToFile(res['body'], filename);
                this.spinner.hide();
                this.handleFileInput(newFile, source);
                this.display = false;
            }).catch(error => {
                this.display = false;
                this.spinner.hide();
            });
        }
    }

    handleFileInput(file, source) {
        if (file) {
            this.spinner.show();
            if (this.fileNamesList && this.fileNamesList.indexOf(file.name) >= 0 ||
                this.files && this.files.indexOf(file.name) >= 0 ||
                this.fileToUpload && this.filesToUpload.indexOf(file.name) >= 0) {
                this.notifier.notify('warning', 'Same File Name Exist.');
                this.spinner.hide();
            } else {
                file.duration = '00:00:06';
                this.fileToUpload.push(file);
                this.fileNamesList.push(file.name);
                this.fileInfo.push({ 'name': file.name, 'source': source });
                this.display = false;
                if (file.type.substr(0, 5) === 'video' && source === 'PC') {
                    this.service.addForPreview(file).toPromise();
                }
            }
        }
        this.spinner.hide();
        this.display = false;
        if (source === 'PC') {
            document.getElementById('myfile')['value'] = '';
        }
    }

    getConvertedFile(filename, index) {
        if (this.scheduleId) {
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
        } else {
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
    }

    showImagePreview(file: Blob) {
        this.spinner.show();
        this.isPreviewVideo = false;
        const reader = new FileReader();

        if (this.scheduleId) {
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

        } else {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(null);
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
    }

    onSubmit() {
        this.spinner.show();
        this.durationList = [];
        this.fileToUpload.forEach(file => {
            const dura: any = {};
            dura.name = file.name;
            dura.regex = this.service.timeToMS(file.duration);
            this.durationList.push(dura);
        });
        this.model.durationList = this.durationList;
        if (this.scheduleId) {
            this.model.monthorweek === 'week' ? this.model.scheduleMonthDays = 0 : this.model.weekDays = [];
            this.fileToUpload.forEach(file => {
                const dura: any = {};
                dura.name = file.name;
                dura.regex = this.service.timeToMS(file.duration);
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
            this.model.scheduleId = +this.scheduleId;
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
                if (error.status === 500) {
                    this.notifier.notify('error', error.error.message);
                } else if (error.status === 400) {
                    this.notifier.notify('warning', 'Select File To upload');
                } else {
                    this.notifier.notify('error', error.error.message);
                }
                this.spinner.hide();
            });

        } else {
            this.model.durationList = this.durationList;
            this.model.fileInfo = this.fileInfo;
            this.model.scheduleId = null;
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
                    this.notifier.notify('error', error.error.message);
                }
                this.spinner.hide();
            });
        }

    }
}
