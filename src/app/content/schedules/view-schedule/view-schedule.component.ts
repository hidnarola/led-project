import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-view-schedule',
    templateUrl: './view-schedule.component.html',
    styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
    user_name: string;
    user_role: string;
    files = [];
    // File Type
    uploads = [];
    isPreviewImage: boolean;
    isPreviewVideo: boolean;
    isPreviewObject: boolean;
    videoType: string;
    res: any;
    dto: any;
    repeat: string;
    CONFIG = this.config;
    imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
    constructor(private route: ActivatedRoute, private service: SchedulesService,
        private config: Config, private sanitizer: DomSanitizer,
        private notifier: NotifierService, private router: Router, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.user_name = localStorage.getItem('name');
        // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
        this.spinner.show();
        this.route.params.subscribe(params => {
            this.service.getScheduleById(params['id']).subscribe(res => {
                this.res = res;
                this.repeat = this.res.type;
                this.dto = this.res.scheduleDTO;
                this.files = this.res.multipartImages;
                let HH = ('0' + this.dto.startTime.hour).slice(-2);
                let MM = ('0' + this.dto.startTime.minute).slice(-2);
                this.dto.startTime = HH + ':' + MM + ':00';
                HH = ('0' + this.dto.endTime.hour).slice(-2);
                MM = ('0' + this.dto.endTime.minute).slice(-2);
                this.dto.endTime = HH + ':' + MM + ':00';
                if (this.CONFIG.SCHE_MONT === this.repeat) {
                    // this.dto.scheduleMonthDays = this.service.getValueOfScheduleMonthDays(this.dto.scheduleMonthDays).toString();
                }
                this.spinner.hide();
            }, error => {
                this.notifier.notify('error', error.error.message);
                this.spinner.hide();
                this.router.navigate(['/user/schedules']);
            });
        });
    }

    imagePreview(filename) {
        // this.isPreview = true;
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = false;
        this.spinner.show();
        this.service.getImageForPreview(filename, localStorage.getItem('userid')).toPromise().then(res => {
            this.spinner.hide();
            this.showImagePreview(res['body']);
        }).catch(errorResponse => {
            this.spinner.hide();
        });
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
    showImagePreview(file: Blob) {
        this.spinner.show();
        const reader = new FileReader();
        console.log(file);
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
