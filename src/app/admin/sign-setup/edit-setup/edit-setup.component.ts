import { Component, OnInit } from '@angular/core';

import { SignsService } from '../../../shared/signs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '../../../shared/config';
@Component({
  selector: 'app-edit-setup',
  templateUrl: './edit-setup.component.html',
  styleUrls: ['./edit-setup.component.css']
})
export class EditSetupComponent implements OnInit {
  model: any = {};
  signType: any;
  timezones: any;
  user_name: string;
  user_role: string;
  constructor(private config: Config, private route: ActivatedRoute, private router: Router, private service: SignsService) { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.signType = this.config.signType;
    this.timezones = this.config.timeZone;
    this.route.params.subscribe(params => {
      // // console.log(params['id']);
      this.service.getSingleSign(params['id']).subscribe(res => {
        this.model = res;
        // console.log(res);
      });
    });
  }

  onSubmit() {
    // // console.log(this.model);
    this.service.updateSign(this.model).subscribe(res => {
      this.router.navigate(['/admin/sign-setup']);
    });
  }
}
