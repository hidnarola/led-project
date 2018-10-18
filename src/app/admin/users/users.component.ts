import { Component, OnInit, OnDestroy, } from '@angular/core';
import { UsersService } from '../../shared/users.service';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  data: any;
  user_name: string;
  user_role: string;
  constructor(private service: UsersService, private notifier: NotifierService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [5, 'asc']
    };
    this.getUsers();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getUsers() {
    this.service.getAllUsers().subscribe(res => {
      this.data = res;
      this.dtTrigger.next();
      console.log(res);
    });
  }

  deleteUser(id) {
    // this.service.deleteProfile(id).subscribe(res => {
    //   alert('Not Allowed');
    // });
    this.notifier.notify('info', 'Not Allowed');
    // alert('Not Allowed');
  }

}
