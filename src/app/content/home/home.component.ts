import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';
import { AnnouncementService } from 'src/app/shared/announcement.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    userLogo = '';
    announcementData = null;
    title: boolean = true;


    constructor(
        private userService: UsersService,
        private aservice: AnnouncementService
    ) { }

    ngOnInit() {
        this.userService.getProfileLink().toPromise().then(link => {
            if (link) {
                this.userLogo = link;
            }
        });
        this.getAnnouncement();
    }
    getAnnouncement() {
        this.aservice.getAnnouncement().toPromise().then(data => {
            console.log(data[0]);
            if (data && data.length > 0 && data[0]['status'] === true) {
                this.announcementData = data[0];
            } else {
            }
        }).catch(err => {
            this.announcementData = null;
        });
    }

    remove() {
        this.title = false;
    }
}
