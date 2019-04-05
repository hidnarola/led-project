import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = localStorage.getItem('access-token');
        const apiUrl = environment.apiURL;
        const reqUrl = request.url.trim();
        const url = reqUrl[0] === '/' ? apiUrl + reqUrl : reqUrl;
        console.log('url = ', url);
        let header = {};
        if (currentUser) {
            header = {
                Authorization: `Bearer ${currentUser}`
            };
        }
        request = request.clone({
            url: url,
            setHeaders: header
        });
        // // console.log(JSON.stringify(request));
        return next.handle(request);
    }
}
