import { Component, OnInit, OnDestroy, } from '@angular/core';
import { UsersService } from '../../shared/users.service';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
    dtTrigger = new Subject();
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    data: any;
    user_name: string;
    user_role: string;
    constructor(private service: UsersService, private notifier: NotifierService,
        private confirmationService: ConfirmationService, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.user_name = localStorage.getItem('name');
        // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
        this.dtOptions = {
            pagingType: 'full_numbers',
            destroy: true,
            pageLength: 10,
            order: [5, 'asc']
        };
        this.getUsers();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    getUsers() {
        this.spinner.show();
        this.service.getAllUsers().subscribe(res => {
            this.data = res;
            this.dtTrigger.next();
            // this.getUsers();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
        // this.dtTrigger.next();
    }
    deleteUser(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete all records of this user?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                // this.notifier.notify('info', 'Not Allowed Now');
                this.spinner.show();
                this.service.deleteUser(id).subscribe(res => {
                    this.notifier.notify('success', 'User Deleted Successfully');
                    this.spinner.hide();
                    // this.rerender();
                    this.getUsers();
                }, error => {
                    if (error.status === 200) {
                        this.notifier.notify('success', 'User Deleted Successfully');
                        this.spinner.hide();
                        // this.rerender();
                        this.getUsers();
                    } else {
                        this.spinner.hide();
                    }
                });
            },
            reject: () => {
                this.notifier.notify('info', 'Request Rejected For Delete');
            }
        });
    }

}
