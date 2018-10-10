import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SchedulesService } from '../../shared/schedules.service';
@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  schedules: any = [];
  user_name: string;
  user_role: string;
  // We use this trigger because fetching the list of schedules can be quite long,
  // thus we ensure the data is fetched before rendering
  // dtTrigger: Subject<any> = new Subject();
  constructor(private service: SchedulesService, private notification: NotifierService) { }

  ngOnInit() {

    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    // this.schedules = [];
    this.getSchedules();
  }
  getSchedules() {
    // console.log(localStorage.getItem('userid'));
    this.service.getContiSchedulesByUserId(localStorage.getItem('userid')).subscribe(res => {
      this.schedules = res;
      console.log(res);
    });
  }

  deleteSchedule(id) {
    this.service.deleteContiScheduleById(id).subscribe(res => {
    }, error => {
      if (error.status === 200) {
        this.notification.notify('success', error.error.text);
        // console.log();
        this.getSchedules();
      } else {
        this.notification.notify('error', 'ER' + error.status + ' : ' + error.error.message);
      }
    });

  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }

  // private extractData(res: Response) {
  //   const body = res.json();
  //   return body.data || {};
  // }
}
