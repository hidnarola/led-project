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
        console.log(res);
      });
    });
  }

}
