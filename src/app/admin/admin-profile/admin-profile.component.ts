import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/shared/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

    model: any = {};
    userId: number;
    misMatchPwd: boolean;
    year = new Date().getFullYear();

    constructor(
        private service: UsersService,
        private spinner: NgxSpinnerService,
        private notifier: NotifierService,
        private router: Router
        ) { }

    ngOnInit() {
        this.userId = Number(localStorage.getItem('userid'));
    }
    matchPassword = () => {
        if (this.misMatchPwd) {
            if (this.model.newPassword === this.model.rePassword) {
                this.misMatchPwd = false;
            }
        }
    }
    onSubmit() {
        this.spinner.show();
        this.model.userId = this.userId;
        if (this.model.newPassword !== this.model.rePassword) {
            this.misMatchPwd = true;
            this.spinner.hide();
            return;
        }

        this.service.changePassword(this.model).toPromise().then(res => {
            this.router.navigate(['/user/home']);
            this.notifier.notify('success', 'Password Changed successfully');
            this.model = {};
            this.spinner.hide();
        }).catch(err => {
            if (err.status === 400) {
                this.notifier.notify('error', err.error.message);
                this.spinner.hide();
            }
        });
    }

}
