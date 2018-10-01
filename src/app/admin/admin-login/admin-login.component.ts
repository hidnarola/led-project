import { Component, OnInit } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../../shared/account.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  model: any = {};
  constructor(private service: AccountService, private router: Router, private helper: JwtHelperService) { }

  onSubmit() {

    this.service.login(this.model.email, this.model.password).subscribe(res => {
      // console.log(JSON.stringify(res));
      const decodedToken = this.helper.decodeToken(localStorage.getItem('access-token'));
      // console.log(decodedToken);

      // CHECK USER ROLE
      if (decodedToken.sub === 'ROLE_USER') {
        localStorage.setItem('user_role', 'ROLE_USER');
        this.router.navigate(['home']);
      } else if (decodedToken.sub === 'ROLE_ADMIN') {
        localStorage.setItem('user_role', 'ROLE_ADMIN');
        this.router.navigate(['admin/dashboard']);
      }

    }, error => {
      console.log(error);
    });

    // // For Bypass Login : Testing Purpose
    // this.router.navigate(['admin/dashboard']);
  }


  ngOnInit() {
  }

}
