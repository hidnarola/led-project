import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  user_email: any;
  user_role: any;
  constructor() { }

  ngOnInit() {
    this.user_email = localStorage.getItem('user_email');
    this.user_role = (localStorage.getItem('user_role')).replace('ROLE_', '');
  }

}
