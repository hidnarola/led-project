import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from 'src/app/shared/announcement.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-add-announcement',
    templateUrl: './add-announcement.component.html',
    styleUrls: ['./add-announcement.component.scss']
})
export class AddAnnouncementComponent implements OnInit {
    model = {};

    constructor(
        private notifier: NotifierService,
        private announcementService: AnnouncementService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.getAnnouncement();
    }

    onSubmit() {
        this.spinner.show();
        this.announcementService.addAnnouncement(this.model).toPromise().then(res => {
            this.spinner.hide();
            this.notifier.notify('success', 'Announcement saved successfully!!');
            if (this.model && !this.model.hasOwnProperty('id')) {
                this.getAnnouncement();
            }
        }).catch(err => {
            this.spinner.hide();
            this.notifier.notify('error', err.error.message);
        });
    }

    getAnnouncement() {
        this.announcementService.getAnnouncement().toPromise().then(data => {
            this.spinner.hide();
            if (data && data.length > 0) {
                this.model = data[0];
            } else {
                this.model = {};
            }
        }).catch(err => {
            this.model = {};
            this.spinner.hide();
        });
    }
}
