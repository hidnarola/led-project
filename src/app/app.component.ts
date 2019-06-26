import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AccountService } from './shared/account.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'led-project';
    isLoggedin: boolean;
    mobileMenuActive: boolean;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private permissionsService: NgxPermissionsService
    ) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
        if (localStorage.getItem('authorities') && localStorage.getItem('authorities') !== 'ROLE_ADMIN') {
            this.getDetails();
        }
    }

    onMobileMenuButton(event) {
        this.mobileMenuActive = !this.mobileMenuActive;
        event.preventDefault();
    }

    setIsLoggedin(value) {
        this.isLoggedin = value;
    }

    hideMobileMenu(event) {
        this.mobileMenuActive = false;
        event.preventDefault();
    }

    getDetails() {
        this.permissionsService.flushPermissions();
        this.permissionsService.loadPermissions(JSON.parse(localStorage.getItem('userPermission')));
        this.accountService.about().toPromise().then(res => {
            const privileges = res['userDTO']['privileges'];
            const userRole = res['userDTO']['authorities'][0]['name'];
            this.permissionsService.addPermission(userRole);
            if (privileges && privileges.length > 0) {
                const assignedPrivileges = [];
                privileges.forEach(privilege => {
                    assignedPrivileges.push(privilege['privilegeCode']);
                });
                this.permissionsService.loadPermissions(assignedPrivileges);
            }
        }).catch(err => { });
    }
}
