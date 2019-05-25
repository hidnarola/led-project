import { Component, OnInit } from '@angular/core';

import { SignsService } from '../../../shared/signs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '../../../shared/config';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-edit-setup',
    templateUrl: './edit-setup.component.html',
    styleUrls: ['./edit-setup.component.css']
})
export class EditSetupComponent implements OnInit {
    model: any = {};
    signType: any;
    timezones: any;
    user_name: string;
    user_role: string;

    constructor(
        private config: Config,
        private route: ActivatedRoute,
        private router: Router,
        private service: SignsService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.user_name = localStorage.getItem('name');
        // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
        this.spinner.show();
        this.signType = this.config.signType;
        this.timezones = this.config.timeZone;
        this.route.params.subscribe(params => {
            this.service.getSingleSign(params['id']).subscribe(res => {
                this.model = res;
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
            });
        });
    }

    onSubmit() {
        this.spinner.show();
        this.service.updateSign(this.model).toPromise().then(res => {
            this.spinner.hide();
            this.router.navigate(['/admin/sign-setup']);
        }).catch(err => { });
    }
}
