import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SchedulesService } from '../../shared/schedules.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';

@Component({
    selector: 'app-schedules',
    templateUrl: './schedules.component.html',
    styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnDestroy, OnInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger = new Subject();
    schedules: any = [];
    tableData: boolean;

    constructor(
        private service: SchedulesService,
        private notification: NotifierService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            destroy: true,
            pageLength: 10,
            order: [0, 'desc']
        };
        this.getSchedules();
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
        });
    }
    getSchedules() {
        this.spinner.show();
        this.service.getSchedulesByUserId(localStorage.getItem('userid')).toPromise().then(res => {
            this.schedules = [];
            this.schedules = res;
            this.dtTrigger.next();
            this.spinner.hide();
            (this.schedules && this.schedules.length <= 0) ? this.tableData = true : this.tableData = false;
        }).catch(error => {
            this.spinner.hide();
        });
    }

    deleteSchedule(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.spinner.show();
                this.service.deleteScheduleById(id).toPromise().then(res => {
                    this.notification.notify('success', 'Deleted Successfully');
                    this.spinner.hide();
                    this.rerender();
                    this.getSchedules();
                }).catch(error => {
                    if (error.status === 0) {
                        this.notification.notify('error', 'ER: ' + 'API Disconnected');
                        this.spinner.hide();
                    } else {
                        this.notification.notify('error', 'ER' + error.status + ' : ' + error.error.message);
                        this.spinner.hide();
                    }
                });
            },
            reject: () => {
                this.notification.notify('info', 'Request Rejected For Delete');
            }
        });

    }
    redirectToSend() {
        this.router.navigate(['/user/schedule/send']);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

}
