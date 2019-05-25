import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../shared/account.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
    model: any = {};
    constructor(
        private notifier: NotifierService,
        private service: AccountService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
    }

    onSubmit() {
        this.spinner.show();
        this.service.forgot_password(this.model.email).toPromise().then(res => {
            this.notifier.notify('success', 'New Password send to your email id, Please verify it.');
            this.spinner.hide();
        }).catch(err => {
            this.notifier.notify('error', err.error.message);
            this.spinner.hide();
        });
    }
}
