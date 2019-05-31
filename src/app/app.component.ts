import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'led-project';
    isLoggedin: boolean;
    mobileMenuActive: boolean;

    constructor(
        private router: Router,
    ) { }
    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
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
