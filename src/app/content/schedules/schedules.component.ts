import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SchedulesService } from '../../shared/schedules.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  schedules: any = [];
  user_name: string;
  user_role: string;
  // We use this trigger because fetching the list of schedules can be quite long,
  // thus we ensure the data is fetched before rendering
  // dtTrigger: Subject<any> = new Subject();
  constructor(private service: SchedulesService, private notification: NotifierService,
    private router: Router) { }

  ngOnInit() {

    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [1, 'asc']
    };
    // this.schedules = [];
    this.getSchedules();
  }
  getSchedules() {
    // // console.log(localStorage.getItem('userid'));
    this.service.getSchedulesByUserId(localStorage.getItem('userid')).subscribe(res => {
      this.schedules = res;
      this.dtTrigger.next();
      // console.log(res);
    });
  }
  sendSchedule() {
    this.notification.notify('success', 'Schedule Sent Successfully');
  }
  deleteSchedule(id) {
    this.service.deleteScheduleById(id).subscribe(res => {
    }, error => {
      if (error.status === 200) {
        this.notification.notify('success', error.error.text);
        // // console.log();
        this.getSchedules();
      } else if (error.status === 0) {
        this.notification.notify('error', 'ER: ' + 'API Disconnected');
      } else {
        this.notification.notify('error', 'ER' + error.status + ' : ' + error.error.message);
      }
    });

  }
  redirectToSend() {
    this.router.navigate(['/user/schedule/send']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
