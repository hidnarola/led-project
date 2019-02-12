import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {
  isLoggedin: boolean;
  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('access-token')) {
      this.isLoggedin = true;
    }
  }

}
