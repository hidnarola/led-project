import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';

@Component({
    selector: 'app-admin-header',
    templateUrl: './admin-header.component.html',
    styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

    user_name: string;
    userLogo: any;
    constructor(
        private userService: UsersService
    ) { }

    ngOnInit() {
        this.user_name = localStorage.getItem('name');
        this.userService.getProfileLink().toPromise().then(link => {
            if (link) {
                this.userLogo = link;
            }
        }).catch(err=>{ });
    }

    logout() { }
}
