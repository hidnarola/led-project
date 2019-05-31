import { Component, OnInit, ViewChild } from '@angular/core';
import { AnnouncementService } from 'src/app/shared/announcement.service';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtTrigger = new Subject();
    dtOptions: DataTables.Settings = {};
    announcementData = [];

    constructor(
        private aservice: AnnouncementService,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService,
        private notifier: NotifierService
    ) { }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            destroy: true,
            pageLength: 10,
            retrieve: true,
            order: [2, 'asc']
        };
        this.getAnnouncement();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }


    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }


    getAnnouncement(rerender = false) {
        this.aservice.getAnnouncement().toPromise().then(data => {
            this.announcementData = data;
            if (rerender) {
                this.rerender();
            } else {
                this.dtTrigger.next();
            }
        }).catch(err => { });
    }

    deleteAnnouncement(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete all records of this announcement ?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.spinner.show();
                this.aservice.deleteAnnouncement(id).toPromise().then(res => {
                    this.spinner.hide();
                    this.rerender();
                    this.getAnnouncement();
                    this.notifier.notify('success', 'User Deleted Successfully');
                }).catch(error => { });
            }, reject: () => {
                this.notifier.notify('info', 'Request Rejected For Delete');
            }
        });
    }
}
