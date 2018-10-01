import { Component, OnInit } from '@angular/core';

import { AccountService } from '../shared/account.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model: any = {};

  constructor(private service: AccountService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.service.register(this.model).subscribe(res => {
      console.log(res);
    });
  }

  // checkpwd() {
  //   if (this.model.password === this.model.cpassword) {
  //     this.model.cpassword.invalid();
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

}
