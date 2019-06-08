import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/account.service';

@Component({
    selector: 'app-admin-header',
    templateUrl: './admin-header.component.html',
    styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

    user_name: string;

    constructor(
        private accountService:AccountService
    ) { }

    ngOnInit() {
        this.user_name = localStorage.getItem('name');
    }

    logout() {
        this.accountService.logout();
    }
}
