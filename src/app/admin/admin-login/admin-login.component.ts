import { Component, OnInit } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../../shared/account.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  model: any = {};
  constructor(private notifier: NotifierService, private service: AccountService,
    private router: Router, private helper: JwtHelperService) { }

  onSubmit() {

    this.service.login(this.model.email, this.model.password).subscribe(res => {
      // console.log(JSON.stringify(res));
      const decodedToken = this.helper.decodeToken(localStorage.getItem('access-token'));
      // console.log(decodedToken);
      let user = decodedToken.sub;
      localStorage.setItem('validity', decodedToken.exp);
      let arr = [];
      user = user.replace('{', '');
      user = user.replace('}', ''); // these lines will remove the leading and trailing braces
      // user = user.replace(/=/g, ':');
      arr = user.split(','); // this will give you an array of strings with each index in the format "12=Other Services (Assisted)"
      // console.log(arr);
      arr[3] = arr[3].replace('[Authority{authorityName=\'', '');
      arr[3] = arr[3].replace('\']}', '');
      console.log(arr);
      arr.forEach(function (item) {
        // here you can split again with '=' and do what is required
        const s = item.split('=');
        // const obj = { key: s[0], value: s[1] }; // this is up to your implementation
        // console.log((s[0]).trim() + ' : ' + s[1]);
        localStorage.setItem((s[0]).trim(), s[1]);
      });
      localStorage.setItem('USER', JSON.stringify(arr));
      // console.log(localStorage.getItem('authorities') === 'ROLE_USER' ? true : false);

      // CHECK USER ROLE
      if (localStorage.getItem('authorities') === 'ROLE_USER') {
        this.router.navigate(['home']);
      } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
        this.router.navigate(['admin/dashboard']);
      } else {
        this.notifier.notify('warning', 'ACCESS DENIED');
      }

    }, error => {
      console.log(error);
      this.notifier.notify('error', error.message);
    });

    // // For Bypass Login : Testing Purpose
    // this.router.navigate(['admin/dashboard']);
  }


  ngOnInit() {
  }

}
