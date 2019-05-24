import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    user_name: string;
    user_role: string;
    isAdmin: boolean;
    userLogo: any;

    constructor(
        private userService: UsersService
    ) { }

    ngOnInit() {
        this.user_name = localStorage.getItem('name');
        this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
        if (this.user_role === 'ADMIN') {
            this.isAdmin = true;
        }
        this.userService.getProfileLink().subscribe(link => {
            if (link) {
                this.userLogo = link;
            }
        });
    }
}
