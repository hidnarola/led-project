import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SignsService {

    constructor(
        private http: HttpClient
    ) { }

    getAllSigns() {
        const uri = '/leddesigner/signsn/getAllSignSN';
        return this.http.get(uri);
    }

    getSingleSign(id) {
        const uri = '/leddesigner/signsn/getSignSN?signId=' + id;
        return this.http.get(uri);
    }

    addSign(data) {
        if (data.hasOwnProperty('id')) {
            const uri = '/leddesigner/signsn/updateSignSN';
            return this.http.put(uri, data);
        } else {
            const uri = '/leddesigner/signsn/add';
            return this.http.post(uri, data);
        }
    }

    deleteSign(id) {
        const uri = '/leddesigner/signsn/deleteSignSN?signId=' + id;
        return this.http.delete(uri);
    }

    downloadSign(signId): any {
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
