import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { first } from 'rxjs/operators';
import { AccountService } from '../shared/account.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  constructor(private service: AccountService, private router: Router, private helper: JwtHelperService) { }

  onSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
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


    // this.service.login(this.model.email, this.model.password).
    // pipe(first())
    //   .subscribe(res => {
    //     console.log(JSON.stringify(res));
    //   });

  }

  ngOnInit() {
  }

}
