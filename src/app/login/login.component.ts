import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { first } from 'rxjs/operators';
import { AccountService } from '../shared/account.service';
import { NotifierService } from 'angular-notifier';
import { Config } from '../shared/config';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  constructor(private notifier: NotifierService, private service: AccountService,
    private router: Router, private helper: JwtHelperService,
    private config: Config) {
  }
  ngOnInit() {
    if (localStorage.getItem('access-token')) {
      if (localStorage.getItem('authorities') === 'ROLE_USER') {
        this.router.navigate(['user/home']);
      } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
        this.router.navigate(['admin/dashboard']);
      } else {
        this.notifier.notify('warning', 'ACCESS DENIED. Please Login Again.');
        localStorage.removeItem('access-token');
      }
    }
  }
  onSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
    this.service.login(this.model.email, this.model.password).subscribe(res => {

      const decodedToken = this.helper.decodeToken(localStorage.getItem('access-token'));
      let user = decodedToken.sub;
      // console.log(user);
      localStorage.setItem('validity', decodedToken.exp);
      let arr = [];
      user = user.replace('{', '');
      user = user.replace('}', ''); // these lines will remove the leading and trailing braces
      // user = user.replace(/=/g, ':');
      arr = user.split(','); // this will give you an array of strings with each index in the format "12=Other Services (Assisted)"
      // // console.log(arr);
      arr[3] = arr[3].replace('[Authority{authorityName=\'', '');
      arr[3] = arr[3].replace('\']}', '');
      // console.log(arr);
      arr.forEach(function (item) {
        // here you can split again with '=' and do what is required
        const s = item.split('=');
        // const obj = { key: s[0], value: s[1] }; // this is up to your implementation
        // // console.log((s[0]).trim() + ' : ' + s[1]);
        localStorage.setItem((s[0]).trim(), s[1]);
      });
      localStorage.setItem('USER', JSON.stringify(arr));
      // this.config.isLoggedIn = true;
      // CHECK USER ROLE
      if (localStorage.getItem('authorities') === 'ROLE_USER') {
        this.router.navigate(['user/home']);
      } else if (localStorage.getItem('authorities') === 'ROLE_ADMIN') {
        this.router.navigate(['admin/dashboard']);
      } else {
        this.notifier.notify('warning', 'ACCESS DENIED');
      }

    }, error => {
      // // console.log(error);
      if (error.status === 403 && error.statusText  === 'OK') {
        this.notifier.notify('error', 'Invalid Email or Password');
      } else {
        this.notifier.notify('error', error.message);
      }
    });


    // this.service.login(this.model.email, this.model.password).
    // pipe(first())
    //   .subscribe(res => {
    //     // console.log(JSON.stringify(res));
    //   });

  }



}
