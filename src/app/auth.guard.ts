import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private permissionsService: NgxPermissionsService,
         private notifier: NotifierService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (localStorage.getItem('access-token') && (localStorage.getItem('authorities') === 'ROLE_USER'
        || localStorage.getItem('authorities') === 'ROLE_SUB_USER')) {
            // logged in so return true
            const currentStamp = new Date().getTime() / 1000;
            if (Number(localStorage.getItem('validity')) > currentStamp) {
                return true;
            } else {
                // Time Out Session
                this.notifier.notify('info', 'Session Time-Out. Please Login Again');
                this.permissionsService.flushPermissions();
                localStorage.clear();
            }
        }
        this.permissionsService.loadPermissions(JSON.parse(localStorage.getItem('userPermission')));

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;

    }
}
