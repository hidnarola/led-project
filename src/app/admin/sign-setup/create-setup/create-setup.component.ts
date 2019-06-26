import { Component, OnInit } from '@angular/core';
import { SignsService } from '../../../shared/signs.service';
import { Config } from '../../../shared/config';
import { NotifierService } from 'angular-notifier';
import { Router, ActivatedRoute } from '@angular/router';
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
    setUpId: any;

    constructor(
        private notifier: NotifierService,
        private service: SignsService,
        private config: Config,
        private router: Router,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.signType = this.config.signType;
        this.timezones = this.config.timeZone;
        this.model.type = this.signType[0];
        this.model.timezone = 'America/Los_Angeles : (GMT-08:00) Pacific Time';

        this.route.params.subscribe(params => {
            this.setUpId = params['id'];
            if (this.setUpId) {
                this.model = {};
                this.service.getSingleSign(this.setUpId).toPromise().then(res => {
                    this.model = res;
                    this.spinner.hide();
                }).catch(error => {
                    this.spinner.hide();
                });
            }
        });
    }
    onSubmit() {
        this.spinner.show();
        this.service.addSign(this.model).toPromise().then(res => {
            this.spinner.hide();
            if (this.setUpId) {
                this.notifier.notify('success', 'Updated Successfully');
            } else {
                this.notifier.notify('success', 'Added Successfully');
            }
            this.router.navigate(['/admin/sign-setup']);
        }).catch(error => {
            this.spinner.hide();
            this.notifier.notify('error', error.error.message);

        });
    }
}
