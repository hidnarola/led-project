import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    model: any = {};
    userId: number;
    misMatchPwd: boolean;

    constructor(
        private service: UsersService,
        private spinner: NgxSpinnerService,
        private notifier: NotifierService,
        private router: Router) { }

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
            this.spinner.hide();
            this.notifier.notify('success', 'Password Changed successfully');
            this.model = {};
            this.router.navigate(['/user/home']);
        }).catch(err => {
            this.spinner.hide();
            if (err.status === 400) {
                this.notifier.notify('error', err.error.message);
            }
        });
    }
}
