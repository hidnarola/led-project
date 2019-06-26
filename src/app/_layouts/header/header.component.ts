import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/account.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    user_name: string;
    isAdmin = false;

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
