import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { UsersService } from '../../shared/users.service';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtTrigger = new Subject();
    dtOptions: DataTables.Settings = {};
    data: any = [];

    constructor(
        private service: UsersService,
        private notifier: NotifierService,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            destroy: true,
            pageLength: 10,
            order: [5, 'asc']
        };
        this.data = [];
        this.getUsers();
        this.route.url.subscribe(params => {
        });
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    getUsers(rerender = false) {
        this.spinner.show();
        this.service.getAllUsers().toPromise().then(res => {
            this.data = res;
            if (rerender) {
                this.rerender();
            } else {
                this.dtTrigger.next();
            }
            this.spinner.hide();
        }).catch(error => {
            this.spinner.hide();
        });
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }
    deleteUser(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete all records of this user?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.spinner.show();
                this.service.deleteUser(id).toPromise().then(res => {
                    this.spinner.hide();
                    this.getUsers(true);
                    this.notifier.notify('success', 'User Deleted Successfully');
                }).catch(error => {  this.spinner.hide(); });
            },
            reject: () => {
                this.notifier.notify('info', 'Request Rejected For Delete');
            }
        });
    }
}
