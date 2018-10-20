import { Component, OnInit } from '@angular/core';
import { SchedulesService } from 'src/app/shared/schedules.service';
import { UserSignService } from 'src/app/shared/user-sign.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-send-schedule',
  templateUrl: './send-schedule.component.html',
  styleUrls: ['./send-schedule.component.scss']
})
export class SendScheduleComponent implements OnInit {
  user_name: string;
  user_role: string;
  cars = [];
  mySchedules: any = [];
  mySigns: any = [];
  model: any = {};
  constructor(private service: SchedulesService, private usservice: UserSignService,
    private notifier: NotifierService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.getSchedule();
    this.getSigns();
  }

  getSchedule() {
    this.service.getFilesByUserId(localStorage.getItem('userid')).subscribe(res => {
      this.mySchedules = res;
      // console.log(res);
    });

  }

  getSigns() {
    this.usservice.getSignByUserId_user(localStorage.getItem('userid')).subscribe(res => {
      this.mySigns = res;
      // console.log(res);
    });
  }

  sendSchedule() {

    for (let i = 0; i < this.model.entryIPList.length; i++) {
      this.model.entryIPList[i].selected = true;
      this.model.entryIPList[i].selection = true;
    }

    // console.log(this.model);
    this.service.sendFileByUserId(this.model, localStorage.getItem('userid')).subscribe(res => {
      // console.log(res);
    }, error => {
      if (error.status === 200) {
        this.notifier.notify('success', 'Send Successfully');
      } else if (error.status === 500) {
        this.notifier.notify('error', 'Error to sending schedule');
      } else {
        this.notifier.notify('error', error.error.message);
      }
    });
  }

}
