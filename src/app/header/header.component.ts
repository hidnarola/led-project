import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user_name: string;

  constructor() { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
  }

}
