import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../shared/account.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  constructor(private service: AccountService) { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
    this.service.forgot_password(this.model.email).subscribe(res => {
      console.log(res);
    });
  }


}
