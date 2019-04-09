import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { first } from 'rxjs/operators';
import { AccountService } from '../shared/account.service';
import { NotifierService } from 'angular-notifier';
import { Config } from '../shared/config';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    currentYear: any;
    model: any = {};
    constructor(private notifier: NotifierService, private service: AccountService,
        private router: Router, private helper: JwtHelperService,
        private config: Config) {
    }
    ngOnInit() {
        if (localStorage.getItem('access-token')) {
            if (localStorage.getItem('authorities') === 'ROLE_USER') {
                this.router.navigate(['user/home']);
            } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
                this.router.navigate(['admin/dashboard']);
            } else {
                this.notifier.notify('warning', 'ACCESS DENIED. Please Login Again.');
                localStorage.clear();
            }
        }
        this.currentYear = new Date().getFullYear();
    }
    onSubmit() {
        this.service.login(this.model.email, this.model.password).subscribe(res => {
            if (res) {
                const decodedToken = this.helper.decodeToken(localStorage.getItem('access-token'));
                const user = decodedToken.sub;
                localStorage.setItem('validity', decodedToken.exp);
                const userDetail = JSON.parse(user);
                localStorage.setItem('email', userDetail['email']);
                localStorage.setItem('name', userDetail['name']);
                localStorage.setItem('userid', userDetail['userid']);
                localStorage.setItem('user_email', userDetail['email']);
                localStorage.setItem('authorities', userDetail['authorities'][0]['name']);

                if (localStorage.getItem('authorities') === 'ROLE_USER') {
                    this.router.navigate(['user/home']);
                } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
                    this.router.navigate(['admin/dashboard']);
                } else {
                    this.notifier.notify('warning', 'ACCESS DENIED');
                }
            } else {
                this.notifier.notify('error', 'Can not get Token from Server');
            }
        }, error => {
            console.log(error);
            if (error.status === 403 && error.statusText === 'OK') {
                this.notifier.notify('error', 'Invalid Email or Password');
            } else {
                this.notifier.notify('error', error.message);
            }
        });
    }
}
