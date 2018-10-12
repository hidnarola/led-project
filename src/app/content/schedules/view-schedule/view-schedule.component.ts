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
        let HH = this.dto.startTime.hour > 9 ? this.dto.startTime.hour : '0' + this.dto.startTime.hour;
        let MM = this.dto.startTime.minute > 9 ? this.dto.startTime.minute : '0' + this.dto.startTime.minute;
        this.dto.startTime = HH + ':' + MM + ':00';
        HH = this.dto.endTime.hour > 9 ? this.dto.endTime.hour : '0' + this.dto.endTime.hour;
        MM = this.dto.endTime.minute > 9 ? this.dto.endTime.minute : '0' + this.dto.endTime.minute;
        this.dto.endTime = HH + ':' + MM + ':00';
        console.log(res);
      }, error => {
        console.log(error.error.message);
      });
    });
  }
}
