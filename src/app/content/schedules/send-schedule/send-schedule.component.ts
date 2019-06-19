import { Component, OnInit } from '@angular/core';
import { SchedulesService } from 'src/app/shared/schedules.service';
import { UserSignService } from 'src/app/shared/user-sign.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-send-schedule',
    templateUrl: './send-schedule.component.html',
    styleUrls: ['./send-schedule.component.scss']
})
export class SendScheduleComponent implements OnInit {

    mySchedules: any = [];
    mySigns: any = [];
    model: any = {};
    entryIPList = [];
    filePropertiesList = [];
    disableSchedule = false;
    disableSign = false;

    constructor(
        private service: SchedulesService,
        private usservice: UserSignService,
        private notifier: NotifierService,
        private router: Router,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.getSchedule();
        this.getSigns();
    }

    getSchedule() {
        this.spinner.show();
        this.service.getFilesByUserId(localStorage.getItem('userid')).toPromise().then(res => {
            this.mySchedules = res;
            this.spinner.hide();
            (this.mySchedules && this.mySchedules.length <= 0) ? this.disableSchedule = true : this.disableSchedule = false;
        }).catch(error => {
            this.spinner.hide();
        });
    }

    getSigns() {
        this.spinner.show();
        this.usservice.getSignByUserId_user(localStorage.getItem('userid')).toPromise().then(res => {
            this.spinner.hide();
            this.mySigns = res;
            (this.mySigns && this.mySigns.length <= 0) ? this.disableSign = true : this.disableSign = false;
        }).catch(error => {
            this.spinner.hide();
        });
    }

    sendSchedule() {
        this.model.entryIPList = this.entryIPList;
        this.model.filePropertiesList = this.filePropertiesList;
        if (this.entryIPList.length === 0) {
            this.notifier.notify('error', 'Select sign');
        } else if (this.filePropertiesList.length === 0) {
            this.notifier.notify('error', 'Select schedule');
        } else {
            for (let i = 0; i < this.entryIPList.length; i++) {
                this.model.entryIPList[i] = this.mySigns[this.entryIPList[i]];
                this.model.entryIPList[i].selected = true;
                this.model.entryIPList[i].selection = true;
            }
            for (let i = 0; i < this.filePropertiesList.length; i++) {
                this.model.filePropertiesList[i] = this.mySchedules[this.filePropertiesList[i]];
            }
            setTimeout(() => {
                this.notifier.notify('success', 'connecting...');
            }, 500);

            setTimeout(() => {
                this.notifier.notify('success', 'Loading...');
            }, 500);

            setTimeout(() => {
                this.spinner.show();
                this.service.sendFileByUserId(this.model, localStorage.getItem('userid')).toPromise().then(res => {
                    const keys = Object.keys(res);
                    keys.forEach(key => {
                        this.notifier.notify((res[key] == 'fail' ? 'error' : 'success'), key + ' is ' + res[key]);
                    });
                    this.model = {};
                    setTimeout(() => {
                        this.spinner.hide();
                        this.router.navigate(['/user/schedules']);
                    }, 1500);
                }).catch(error => {
                    if (error.status === 500) {
                        this.notifier.notify('error', 'Failed');
                        setTimeout(() => {
                            this.spinner.hide();
                            this.router.navigate(['/user/schedules']);
                        }, 2000);
                    } else {
                        this.notifier.notify('error', 'Failed');
                        setTimeout(() => {
                            this.spinner.hide();
                            this.router.navigate(['/user/schedules']);
                        }, 2000);
                    }
                });
            }, 1000);
        }
    }

}
