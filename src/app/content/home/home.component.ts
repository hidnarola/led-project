import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';
import { AnnouncementService } from 'src/app/shared/announcement.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AccountService } from 'src/app/shared/account.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [
        trigger('hideElememt', [
            transition(':leave', [
                animate('1s', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class HomeComponent implements OnInit {
    userLogo = '';
    announcementData = null;

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
            if (data && data.length > 0 && data[0]['status'] === true) {
                this.announcementData = data[0];
            } else {
                this.announcementData = null;
            }
        }).catch(err => {
            this.announcementData = null;
        });
    }

    changeState() {
        this.announcementData = null;
    }
}
