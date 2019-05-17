import { Component } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'led-project';
  isLoggedin: boolean;
  mobileMenuActive: boolean;

  constructor(
    private permissionsService: NgxPermissionsService
  ) {
    if (localStorage.getItem('userPermission')) {
      permissionsService.loadPermissions(localStorage.getItem('userPermission').split(','));
    }
  }
  onMobileMenuButton(event) {
    this.mobileMenuActive = !this.mobileMenuActive;
    event.preventDefault();
  }

  setIsLoggedin(value) {
    this.isLoggedin = value;
  }

  hideMobileMenu(event) {
    this.mobileMenuActive = false;
    event.preventDefault();
  }
}
