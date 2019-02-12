import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../shared/account.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  constructor(private notifier: NotifierService, private service: AccountService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
    this.spinner.show();
    this.service.forgot_password(this.model.email).subscribe(res => {
      // console.log(res);
      this.notifier.notify('success', res.toString());
      this.spinner.hide();
    },
      error => {
        if (error.status === 200) {
          this.notifier.notify('success', 'New Password send to your email id, Please verify it.');
        } else {
          this.notifier.notify('error', error.error.message);
        }
        this.spinner.hide();
      }
    );
  }


}
