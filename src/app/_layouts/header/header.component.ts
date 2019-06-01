import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';
import { AccountService } from 'src/app/shared/account.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    user_name: string;
    isAdmin: boolean;
    userLogo: any;

    constructor(
        private accountService: AccountService
    ) { }

    ngOnInit() {
        this.user_name = localStorage.getItem('name');
        if (localStorage.getItem('authorities') && localStorage.getItem('authorities') === 'ROLE_ADMIN') {
            this.isAdmin = true;
        }
    }
    logout() { 
        this.accountService.logout();
    }
}
