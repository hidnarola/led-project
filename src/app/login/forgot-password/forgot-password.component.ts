import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../shared/account.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  constructor(private notifier: NotifierService, private service: AccountService) { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
    this.service.forgot_password(this.model.email).subscribe(res => {
      // console.log(res);
      this.notifier.notify('success', 'Instructions are sent to your Email ID');
    },
      error => {
        this.notifier.notify('error', error.message);
      }
    );
  }


}
