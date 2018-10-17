import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './demo.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user_name: any;
  user_role: any;
  constructor() { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
  }


}
