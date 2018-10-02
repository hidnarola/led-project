import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {
  user_email: string;
  user_role: string;

  constructor() { }

  ngOnInit() {

    this.user_email = localStorage.getItem('user_email');
    this.user_role = (localStorage.getItem('user_role')).replace('ROLE_', '');
  }

}
