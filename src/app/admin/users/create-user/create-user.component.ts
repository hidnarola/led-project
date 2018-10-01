import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../../shared/account.service';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  model: any = {};
  constructor(private service: AccountService) { }

  ngOnInit() {
    this.model.isAdmin = false;
  }


  onSubmit() {
    // alert(JSON.stringify(this.model));
    this.service.register(this.model).subscribe(res => {
      console.log(res);
    });
  }

}
