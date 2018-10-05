import { Component, OnInit } from '@angular/core';

import { NotifierService } from 'angular-notifier';
import { AccountService } from '../../../shared/account.service';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  model: any = {};
  user_name: string;
  user_role: string;
  constructor(private notifier: NotifierService, private service: AccountService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.model.isAdmin = false;
  }


  onSubmit() {
    // alert(JSON.stringify(this.model));
    this.service.register(this.model).subscribe(res => {
      console.log(res);
      this.notifier.notify('success', 'Account Created Successfully');
    },
    error => {
      this.notifier.notify('error', error.message);
    }
    );
  }

}
