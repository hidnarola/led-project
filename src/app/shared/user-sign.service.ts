import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserSignService {
    constructor(
        private http: HttpClient
    ) { }

    // Use For User Side
    getSignByUserId_user(id) {
        if (id) {
            const uri = '/leddesigner/signmapping/getUserSigns?userid=' + id;
            return this.http.get(uri).pipe(map(res => {
                return res;
            }));
        }
    }

    // Use For Admin Side
    getSignByUserId_admin(id) {
        const uri = '/leddesigner/signmapping/getUserSignMapping?userid=' + id;
        return this.http.get(uri);
    }

    addUserSign(sid, uid) {
        const uri = '/leddesigner/signmapping/addUserSigns';
        const us = {
            signid: Number(sid),
            userid: Number(uid)
        };
        return this.http
            .post(uri, us)
            .pipe(map(res => {
                return res;
            }
            ));
    }

    deleteUserSign(id) {
        const uri = '/leddesigner/signmapping/deleteMapping?id=' + id;
        return this.http.delete(uri);
    }

    getSignBySignId(id) {
        const uri = '/leddesigner/signmapping/getSignUsers?signid=' + id;
        return this.http.get(uri);
    }

    downloadDiagnostic(signId): any {
        const httpOptions = {};
        httpOptions['responseType'] = 'Blob' as 'json';
        httpOptions['observe'] = 'response';
        const uri = '/leddesigner/signsn/diagnostic-file?signId=' + signId;
        return this.http.get(uri, httpOptions);
    }

    downloadFile(blob, fileName: string) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        window.setTimeout(function () {
            URL.revokeObjectURL(blob);
            document.body.removeChild(link);
        }, 0);
    }

}
