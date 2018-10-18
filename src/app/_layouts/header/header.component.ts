import { Component, OnInit } from '@angular/core';
// import { Config } from '../shared/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user_name: string;
  isLoggedIn: boolean;
  constructor(
    // private config: Config
    ) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    // this.isLoggedIn = this.config.isLoggedIn;
  }

}
