import { Component, OnInit, OnDestroy } from '@angular/core';
// import $ from 'jquery';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { SignsService } from '../../shared/signs.service';
@Component({
  selector: 'app-sign-setup',
  templateUrl: './sign-setup.component.html',
  styleUrls: ['./sign-setup.component.css']
})
export class SignSetupComponent implements OnInit, OnDestroy {
  data: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  user_name: string;
  user_role: string;
  constructor(private service: SignsService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [0, 'asc']
    };

    this.getSigns();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  getSigns() {
    this.service.getAllSigns().subscribe(res => {
      this.data = res;
      this.dtTrigger.next();
      // console.log(res);
    });
  }
  deleteSign(id) {
    // // console.log(id);
    this.service.deleteSign(id).subscribe(res => {
      // console.log(res);
    });
  }
}
