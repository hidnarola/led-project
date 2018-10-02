import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
user_email: any;
  constructor() { }

  ngOnInit() {
    this.user_email = localStorage.getItem('user_email');
  }

  logout() {
    alert('Logout');
  }
}
