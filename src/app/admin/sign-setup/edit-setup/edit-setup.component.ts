import { Component, OnInit } from '@angular/core';

import { SignsService } from '../../../shared/signs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '../../../shared/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
@Component({
    selector: 'app-edit-setup',
    templateUrl: './edit-setup.component.html',
    styleUrls: ['./edit-setup.component.css']
})
export class EditSetupComponent implements OnInit {
    model: any = {};
    signType: any;
    timezones: any;

    constructor(
        private config: Config,
        private route: ActivatedRoute,
        private router: Router,
        private notifier: NotifierService,
        private service: SignsService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.spinner.show();
        this.signType = this.config.signType;
        this.timezones = this.config.timeZone;
        this.route.params.subscribe(params => {
            this.service.getSingleSign(params['id']).toPromise().then(res => {
                this.model = res;
                this.spinner.hide();
            }).catch(error => {
                this.spinner.hide();
            });
        });
    }

    onSubmit() {
        this.spinner.show();
        this.service.updateSign(this.model).toPromise().then(res => {
            this.spinner.hide();
            this.notifier.notify('success', 'Updated Successfully');
            this.router.navigate(['/admin/sign-setup']);
        }).catch(err => { });
    }
}
