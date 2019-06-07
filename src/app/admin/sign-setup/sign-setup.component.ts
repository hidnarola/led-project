import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
// import $ from 'jquery';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { SignsService } from '../../shared/signs.service';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
@Component({
    selector: 'app-sign-setup',
    templateUrl: './sign-setup.component.html',
    styleUrls: ['./sign-setup.component.css']
})
export class SignSetupComponent implements OnInit, OnDestroy {
    data: any;
    dtOptions: DataTables.Settings = {};
    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    constructor(
        private service: SignsService,
        private notifier: NotifierService,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            destroy: true,
            pageLength: 10,
            order: [0, 'desc']
        };
        this.getSigns();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    getSigns(rerender = false) {
        this.spinner.show();
        this.service.getAllSigns().subscribe(res => {
            this.data = res;
            rerender ? this.rerender() : this.dtTrigger.next();
            setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
            }, 1000);
        }, error => {
            this.spinner.hide();
        });
    }

    deleteSign(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.service.deleteSign(id).subscribe(res => {
                    this.notifier.notify('success', 'Deleted Successfully');
                    this.getSigns(true);
                }, error => {
                        this.spinner.hide();
                });
            },
            reject: () => {
                this.notifier.notify('info', 'Request Rejected For Delete');
            }
        });
    }
}
