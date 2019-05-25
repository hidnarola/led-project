import { Component, OnInit } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../../shared/account.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    model: any = {};
    constructor(
        private notifier: NotifierService,
        private service: AccountService,
        private router: Router,
        private helper: JwtHelperService,
        private spinner: NgxSpinnerService) { }

    onSubmit() {
        this.spinner.show();
        this.service.login(this.model.email, this.model.password).toPromise().then(res => {
            const decodedToken = this.helper.decodeToken(localStorage.getItem('access-token'));
            let user = decodedToken.sub;
            localStorage.setItem('validity', decodedToken.exp);
            let arr = [];
            user = user.replace('{', '');
            user = user.replace('}', ''); // these lines will remove the leading and trailing braces
            // user = user.replace(/=/g, ':');
            arr = user.split(','); // this will give you an array of strings with each index in the format "12=Other Services (Assisted)"
            arr[3] = arr[3].replace('[Authority{authorityName=\'', '');
            arr[3] = arr[3].replace('\']}', '');
            arr.forEach(function (item) {
                // here you can split again with '=' and do what is required
                const s = item.split('=');
                // const obj = { key: s[0], value: s[1] }; // this is up to your implementation
                localStorage.setItem((s[0]).trim(), s[1]);
            });
            localStorage.setItem('USER', JSON.stringify(arr));

            // CHECK USER ROLE
            if (localStorage.getItem('authorities') === 'ROLE_USER') {
                this.router.navigate(['home']);
            } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
                this.router.navigate(['admin/dashboard']);
            } else {
                this.notifier.notify('warning', 'ACCESS DENIED');
            }
            this.spinner.hide();
        }).catch(err => {
            this.notifier.notify('error', err.error.message);
            this.spinner.hide();
        });

        // // For Bypass Login : Testing Purpose
        // this.router.navigate(['admin/dashboard']);
    }


    ngOnInit() {
        if (localStorage.getItem('access-token')) {
            if (localStorage.getItem('authorities') === 'ROLE_USER') {
                this.router.navigate(['home']);
            } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
                this.router.navigate(['admin/dashboard']);
            } else {
                this.notifier.notify('warning', 'ACCESS DENIED. Please Login Again.');
                localStorage.clear();
            }
        }
    }

}
