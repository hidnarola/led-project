import { Component, OnInit } from '@angular/core';
import { UserSignService } from '../../shared/user-sign.service';
@Component({
  selector: 'app-my-signs',
  templateUrl: './my-signs.component.html',
  styleUrls: ['./my-signs.component.css']
})
export class MySignsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  userid: string;
  signArray: any = [];
  user_name: string;
  user_role: string;
  constructor(private service: UserSignService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.userid = localStorage.getItem('userid');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.getSignByUser();
  }

  getSignByUser() {
    this.service.getSignByUserId_user(this.userid).subscribe(res => {
      this.signArray = res;
      console.log(res);
    });
  }
}
