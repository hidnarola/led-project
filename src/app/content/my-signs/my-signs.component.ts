import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSignService } from '../../shared/user-sign.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-my-signs',
  templateUrl: './my-signs.component.html',
  styleUrls: ['./my-signs.component.css']
})
export class MySignsComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  userid: string;
  signArray: any = [];
  user_name: string;
  user_role: string;
  constructor(private service: UserSignService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.userid = localStorage.getItem('userid');
    this.dtOptions = {
      pagingType: 'full_numbers', destroy: true,
      pageLength: 5,
      order: [0, 'asc']
      // ajax: this.signArray,
      // columns: [{
      //   title: 'Serial',
      //   data: 'serial_number'
      // }, {
      //   title: 'Name',
      //   data: 'name'
      // }, {
      //   title: 'Host',
      //   data: 'ipaddress'
      // }]
    };
    this.getSignByUser();
    // setTimeout(() => {

    // }, 500);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // private extractData(res: Response) {
  //   const body = res.json();
  //   return body.data || {};
  // }

  getSignByUser() {
    this.spinner.show();
    this.service.getSignByUserId_user(this.userid).subscribe(res => {
      this.signArray = res;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
      this.spinner.hide();
      // console.log(res);
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
}
