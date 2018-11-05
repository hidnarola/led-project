import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SchedulesService } from '../../shared/schedules.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private router: Router, private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {

    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.dtOptions = {
      pagingType: 'full_numbers',
      destroy: true,
      pageLength: 10,
      order: [0, 'desc']
    };
    // this.schedules = [];
    this.getSchedules();
  }
  getSchedules() {
    this.spinner.show();
    // // console.log(localStorage.getItem('userid'));
    this.service.getSchedulesByUserId(localStorage.getItem('userid')).subscribe(res => {
      this.schedules = res;
      this.dtTrigger.next();
      this.spinner.hide();
      console.log(res);
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  sendSchedule() {
    this.notification.notify('success', 'Schedule Sent Successfully');
  }
  deleteSchedule(id) {
    // console.log(id);
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.spinner.show();
        this.service.deleteScheduleById(id).subscribe(res => {
          this.notification.notify('success', 'Deleted Successfully');
          // this.dtTrigger.next();
          this.spinner.hide();
          this.getSchedules();
        }, error => {
          if (error.status === 200) {
            this.notification.notify('success', error.error.text);
            // // console.log();
            // this.dtTrigger.next();
            this.spinner.hide();
            this.getSchedules();
          } else if (error.status === 0) {
            this.notification.notify('error', 'ER: ' + 'API Disconnected');
            this.spinner.hide();
          } else {
            this.notification.notify('error', 'ER' + error.status + ' : ' + error.error.message);
            this.spinner.hide();
          }
        });
      },
      reject: () => {
        this.notification.notify('info', 'Request Rejected For Delete');
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
