import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    userLogo = '';
    constructor(
        private userService: UsersService
    ) { }

    ngOnInit() {
        this.userService.getProfileLink().toPromise().then(link => {
            if (link) {
                this.userLogo = link;
            }
        });
    }
}
