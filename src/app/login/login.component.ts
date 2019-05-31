import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../shared/account.service';
import { NotifierService } from 'angular-notifier';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    currentYear: any;
    model: any = {};
    permissionData = [];

    constructor(private notifier: NotifierService,
        private service: AccountService,
        private router: Router,
        private helper: JwtHelperService,
        private permissionsService: NgxPermissionsService,
    ) { }
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
                userDetail['authorities'].forEach((authorities) => {
                    this.permissionData.push((Object.values(authorities)[0]));
                    if (authorities['name'] === 'ROLE_USER' || authorities['name'] === 'ROLE_ADMIN'
                    || authorities['name'] === 'ROLE_SUB_USER') {
                        localStorage.setItem('authorities', authorities['name']);
                    }
                });
                if (this.permissionData.length > 0) {
                    this.permissionsService.addPermission(this.permissionData,(permissionName, permissionStore) => {
                        return true;
                    });
                    localStorage.setItem('userPermission', JSON.stringify(this.permissionData));
                }
                if (localStorage.getItem('authorities') === 'ROLE_SUB_USER' || localStorage.getItem('authorities') === 'ROLE_USER') {
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
            if (error.status === 403 && error.statusText === 'OK') {
                this.notifier.notify('error', 'Invalid Email or Password');
            } else {
                this.notifier.notify('error', error.message);
            }
        });
    }
}
