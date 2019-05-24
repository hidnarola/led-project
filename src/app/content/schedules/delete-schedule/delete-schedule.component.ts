import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { UserSignService } from 'src/app/shared/user-sign.service';
import { SchedulesService } from 'src/app/shared/schedules.service';

@Component({
    selector: 'app-delete-schedule',
    templateUrl: './delete-schedule.component.html',
    styleUrls: ['./delete-schedule.component.scss']
})
export class DeleteScheduleComponent implements OnInit {
    model: any = {};
    items: MenuItem[];
    config: any = {};
    p1 = 1;
    p2 = 1;
    sign: any;
    mySigns: any = [];
    mySchedules: any = [];
    entryIPList = [];
    filePropertiesList = [];
    activeIndex = 0;
    constructor(
        private spinner: NgxSpinnerService,
        private notifier: NotifierService,
        private router: Router,
        private usservice: UserSignService,
        private service: SchedulesService) {
    }
    ngOnInit() {
        this.items = [
            { label: 'Select Sign' },
            { label: 'Select Schedules' }
        ];
        this.config = {
            itemsPerPage: 10, currentPage: this.p1,
        };
        this.getSigns();
    }
    getSigns() {
        this.spinner.show();
        this.usservice.getSignByUserId_user(localStorage.getItem('userid')).subscribe(res => {
            this.mySigns = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }
    BakcToSign() {
        this.activeIndex = 0;
        this.entryIPList = [];
        this.filePropertiesList = [];
    }
    getSchedules(sign) {
        this.spinner.show();
        this.filePropertiesList = [];
        this.sign = sign;
        this.entryIPList.push(sign);
        this.service.getScheduleBySignId(localStorage.getItem('userid'), sign.id).subscribe(res => {
            this.mySchedules = res;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
        this.activeIndex = 1;

    }
    deleteSchedule() {
        this.spinner.show();
        this.model.entryIPList = this.entryIPList;
        this.model.filePropertiesList = this.filePropertiesList;

        for (let i = 0; i < this.entryIPList.length; i++) {
            // this.model.entryIPList[i] = this.mySigns[this.entryIPList[i]];
            this.model.entryIPList[i].selected = true;
            this.model.entryIPList[i].selection = true;
        }

        for (let i = 0; i < this.filePropertiesList.length; i++) {
            this.model.filePropertiesList[i] = this.mySchedules[this.filePropertiesList[i]];
        }

        this.service.deleteScheduleByUserId(localStorage.getItem('userid'), this.model).subscribe(res => {
            this.notifier.notify('success', 'Deleted Successfully');
            this.model = {};
            this.spinner.hide();
            this.getSchedules(this.sign);
            // this.BakcToSign();
            // this.router.navigate(['/user/signs/deleteSchedule']);
        }, error => {
            if (error.status === 200) {
                this.notifier.notify('success', 'Deleted Successfully');
                this.model = {};
                setTimeout(() => {
                    /** spinner ends after 1 seconds */
                    this.spinner.hide();
                }, 2000);
                this.getSchedules(this.sign);
                // this.BakcToSign();
                // this.router.navigate(['/user/signs/deleteSchedule']);
            } else if (error.status === 500) {
                this.notifier.notify('error', 'Failed');
                setTimeout(() => {
                    /** spinner ends after 1 seconds */
                    this.spinner.hide();
                }, 1000);
            } else {
                this.notifier.notify('error', 'Failed');
                setTimeout(() => {
                    /** spinner ends after 1 seconds */
                    this.spinner.hide();
                }, 1000);
            }
            // this.spinner.hide();
        });
    }

}
