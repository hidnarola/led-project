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

    files = [];
    isPreviewImage: boolean;
    isPreviewVideo: boolean;
    isPreviewObject: boolean;
    videoType: string;
    res: any;
    dto: any;
    repeat: string;
    CONFIG = this.config;
    imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');

    constructor(
        private route: ActivatedRoute,
        private service: SchedulesService,
        private config: Config,
        private sanitizer: DomSanitizer,
        private notifier: NotifierService,
        private router: Router,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {

        this.spinner.show();
        this.route.params.subscribe(params => {
            this.service.getScheduleById(params['id']).toPromise().then(res => {
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
                this.spinner.hide();
            }).catch(error => {
                this.notifier.notify('error', error.error.message);
                this.spinner.hide();
                this.router.navigate(['/user/schedules']);
            });
        });
    }

    imagePreview(filename) {
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
    showImagePreview(file: Blob) {
        this.spinner.show();
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
}
