import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
  user_name: string;
  user_role: string;
  model: any;

  constructor(private route: ActivatedRoute, private service: SchedulesService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.route.params.subscribe(params => {
      console.log(params['id']);
      // this.service.getScheduleById(params['id']).subscribe(res => {
      //   this.model = res;
      //   console.log(res);
      // });
    });
  }

}
