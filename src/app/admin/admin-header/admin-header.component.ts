import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  user_name: string;
  constructor() { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
  }

  logout() {
    alert('Logout');
  }
}
