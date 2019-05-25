import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../shared/users.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
    model: any = {};
    user_name: string;
    user_role: string;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: UsersService,
        private notify: NotifierService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.user_name = localStorage.getItem('name');
        // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
        this.spinner.show();
        this.route.params.subscribe(params => {
            this.service.getUserProfile(params['id']).subscribe(res => {
                this.model = res;
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
            });
        });
    }

}
