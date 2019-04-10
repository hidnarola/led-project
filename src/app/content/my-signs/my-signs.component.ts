import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSignService } from '../../shared/user-sign.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-my-signs',
    templateUrl: './my-signs.component.html',
    styleUrls: ['./my-signs.component.css']
})
export class MySignsComponent implements OnDestroy, OnInit {
    dtOptions: DataTables.Settings = {};
    dtTrigger = new Subject();
    userid: string;
    signArray: any = [];
    user_name: string;
    user_role: string;
    constructor(
        private service: UserSignService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.userid = localStorage.getItem('userid');
        this.dtOptions = {
            pagingType: 'full_numbers', destroy: true,
            pageLength: 5,
            order: [0, 'asc']
        };
        this.getSignByUser();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    getSignByUser() {
        this.spinner.show();
        this.service.getSignByUserId_user(this.userid).subscribe(res => {
            this.signArray = res;
            this.dtTrigger.next();
            this.spinner.hide();
        }, error => {
            console.log(error);
            this.spinner.hide();
        });
    }

    downloadDiagnostic(signId) {
        this.spinner.show();
        this.service.downloadDiagnostic(signId).toPromise().then(result => {
            if (result) {
                const headers = result.headers.get('content-disposition');
                const filename = headers.split('=')[1];
                this.service.downloadFile(result.body, filename);
                this.spinner.hide();
            }
        }).catch(error => {
            this.spinner.hide();
        });
    }
}
