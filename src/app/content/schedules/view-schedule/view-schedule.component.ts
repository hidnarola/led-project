import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';
@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
  user_name: string;
  user_role: string;
  files = [];
  res: any;
  dto: any;
  repeat: string;
  CONFIG = this.config;
  constructor(private route: ActivatedRoute, private service: SchedulesService, private config: Config) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.service.getScheduleById(params['id']).subscribe(res => {
        this.res = res;
        this.repeat = this.res.type;
        this.dto = this.res.schduleDTO;
        this.files = this.res.multipartImages;
        let HH = ('0' + this.dto.startTime.hour).slice(-2);
        let MM = ('0' + this.dto.startTime.minute).slice(-2);
        this.dto.startTime = HH + ':' + MM + ':00';
        HH = ('0' + this.dto.endTime.hour).slice(-2);
        MM = ('0' + this.dto.endTime.minute).slice(-2);
        this.dto.endTime = HH + ':' + MM + ':00';
        if (this.CONFIG.SCHE_MONT === this.repeat) {
          // this.dto.scheduleMonthDays = this.service.getValueOfScheduleMonthDays(this.dto.scheduleMonthDays).toString();
        }
        console.log(res);
      }, error => {
        console.log(error.error.message);
      });
    });
  }
}
