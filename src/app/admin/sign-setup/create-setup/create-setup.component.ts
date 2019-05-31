import { Component, OnInit } from '@angular/core';
import { SignsService } from '../../../shared/signs.service';
import { Config } from '../../../shared/config';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-create-setup',
    templateUrl: './create-setup.component.html',
    styleUrls: ['./create-setup.component.css']
})
export class CreateSetupComponent implements OnInit {
    signType: any;
    model: any = {};
    timezones: any;

    constructor(
        private notifier: NotifierService,
        private service: SignsService,
        private config: Config,
        private router: Router,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.signType = this.config.signType;
        this.timezones = this.config.timeZone;
        this.model.signtype = this.signType[0];
        this.model.timezone = 'America/Los_Angeles : (GMT-08:00) Pacific Time';
    }
    onSubmit() {
        this.spinner.show();
        this.service.addSign(this.model).toPromise().then(res => {
            this.notifier.notify('success', 'Added Successfully');
            this.spinner.hide();
            this.router.navigate(['/admin/sign-setup']);
        }).catch(error => {
            this.spinner.hide();
        });
    }
}
