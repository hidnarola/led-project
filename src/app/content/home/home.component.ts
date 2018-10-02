import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user_email: any;
  user_role: any;
  constructor() { }

  ngOnInit() {
    this.user_email = localStorage.getItem('user_email');
    this.user_role = (localStorage.getItem('user_role')).replace('ROLE_', '');
  }


}
