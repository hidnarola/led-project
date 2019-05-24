import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/shared/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

  model: any = {};
  userId: number;
  f: FormGroup;
  misMatchPwd: boolean;
  constructor(private service: UsersService, private spinner: NgxSpinnerService, private notifier: NotifierService,
    private router: Router) { }

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userid'));

    // $(document).ready(function () {
    //   $('.pass_show').append('<span class="ptxt">Show</span>');
    // });

    // $(document).on('click', '.pass_show .ptxt', function () {

    //   $(this).text($(this).text() === 'Show' ? 'Hide' : 'Show');

    //   $(this).prev().attr('type', function (index, attr) { return attr === 'password' ? 'text' : 'password'; });

    // });
  }
  matchPassword = () => {
    if (this.misMatchPwd) {
      if (this.model.newPassword === this.model.rePassword) {
        this.misMatchPwd = false;
      }
    }
  }
  onSubmit() {
    this.spinner.show();
    this.model.userId = this.userId;
    if (this.model.newPassword !== this.model.rePassword) {
      this.misMatchPwd = true;
      this.spinner.hide();
      return;
    }

    // this.service.changePassword(this.model).toPromise().then(res => {
    //     this.notifier.notify('success', 'Password Changed successfully');
    //     this.model = {};
    //     this.spinner.hide();
    //     this.router.navigate(['/user/home']);
    // }).catch(error =>{  this.notifier.notify('error', error);
    // this.spinner.hide(); });

    this.service.changePassword(this.model).subscribe(res => {
      this.notifier.notify('success', 'Password Changed successfully');
      this.model = {};
      this.spinner.hide();
      this.router.navigate(['/user/home']);
    }, error => {
      if (error.status === 200) {
        this.notifier.notify('success', 'Password Changed successfully');
        this.model = {};
        this.spinner.hide();
        this.router.navigate(['/user/home']);
      } else {
        this.notifier.notify('error', error.error);
        this.spinner.hide();
      }
    });
  }

}
