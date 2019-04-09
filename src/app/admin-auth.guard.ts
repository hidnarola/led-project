import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
    constructor(private router: Router, private notifier: NotifierService) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (localStorage.getItem('access-token') && localStorage.getItem('authorities') === 'ROLE_ADMIN') {
            const currentStamp = new Date().getTime() / 1000;
            if (Number(localStorage.getItem('validity')) > currentStamp) {
                return true;
            } else {
                this.notifier.notify('info', 'Session Time-Out. Please Login Again');
                localStorage.clear();
            }
        }
        this.router.navigate(['/login']);
        return false;

    }
}
