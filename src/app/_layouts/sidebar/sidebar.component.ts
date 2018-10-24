import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user_name: string;
  user_role: string;
  isAdmin: boolean;

  constructor() { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    if (this.user_role === 'ADMIN') {
      this.isAdmin = true;
    }
  }

  toggleLink(that) {
     // Add active class to the current button (highlight it)
     const header = document.getElementById('myMainNav');
     const btns = header.getElementsByClassName('myNav');
     for (let i = 0; i < btns.length; i++) {
      //  btns[i].addEventListener('click', function () {
         const current = document.getElementsByClassName('active');
         if (current.length > 0) {
           current[0].className = current[0].className.replace(' active', '');
         }
         that.className += ' active';
      //  });
     }
  }

}
