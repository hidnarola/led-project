import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
    console.log('this.model => ', this.model);
    if (this.model.newPassword !== this.model.rePassword) {
      this.misMatchPwd = true;
      this.spinner.hide();
      return;
    }
    this.service.changePassword(this.model).subscribe(res => {
      this.notifier.notify('success', 'Password Changed successfully');
      this.model = {};
      this.spinner.hide();
    }, error => {
      if (error.status === 200) {
        this.notifier.notify('success', 'Password Changed successfully');
        this.model = {};
        this.spinner.hide();
        this.router.navigate(['/user/home']);
      } else {
        console.log('error: Change Password => ', error);
        this.notifier.notify('error', error.error);
        this.spinner.hide();
      }
    });
  }

}
