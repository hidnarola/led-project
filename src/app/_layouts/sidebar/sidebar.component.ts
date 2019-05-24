import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchedulesService } from 'src/app/shared/schedules.service';
import { NotifierService } from 'angular-notifier';
import { UsersService } from 'src/app/shared/users.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    user_name: string;
    user_role: string;
    isAdmin: boolean;
    userProfile: any;

    constructor(
        private service: SchedulesService,
        private notifier: NotifierService,
        private spinner: NgxSpinnerService,
        private userService: UsersService
    ) { }

    ngOnInit() {
        this.user_name = localStorage.getItem('name');
        this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
        if (this.user_role === 'ADMIN') {
            this.isAdmin = true;
        }
    }

    toggleLink(that) {
        // Add active class to the current button (highlight it)
        const header = document.getElementById('myMainNav');
        const btns = header.getElementsByClassName('myNav');
        for (let i = 0; i < btns.length; i++) {
            const current = document.getElementsByClassName('active');
            if (current.length > 0) {
                current[0].className = current[0].className.replace(' active', '');
            }
            that.className += ' active';
        }
    }

    handleFileInput(file) {
        if (file) {
            this.spinner.show();
            file.duration = '00:00:06';
            this.service.uploadFile(file).toPromise().then(res => {
                this.spinner.hide();
                this.notifier.notify('success', 'File uploaded Successfully');
            }).catch(errorResponse => {
                this.notifier.notify('error', errorResponse.error.message);
                this.spinner.hide();
            });
        }
    }
}
