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

        return this.http
            .get(uri)
            .pipe(map(res => {
                return res;
            }
            ));
    }

    getSingleSign(id) {
        const uri = '/leddesigner/signsn/getSignSN?signId=' + id;

        return this.http
            .get(uri)
            .pipe(map(res => {
                return res;
            }
            ));
    }

    addSign(data) {
        const uri = '/leddesigner/signsn/add';
        const signs = {
            serial_number: data.signsn,
            sizeY: Number(data.heighty),
            ipaddress: data.ip,
            name: data.signname,
            port: Number(data.port),
            status: true,
            timezone: data.timezone,
            type: data.signtype,
            sizeX: Number(data.widthx)
        };
        return this.http
            .post(uri, signs)
            .map(res => {
                return res;
            }
            );
    }

    updateSign(data) {
        const uri = '/leddesigner/signsn/updateSignSN';
        const signs = {
            id: data.id,
            serial_number: data.serial_number,
            sizeY: Number(data.sizeY),
            ipaddress: data.ipaddress,
            name: data.name,
            port: Number(data.port),
            status: true,
            timezone: data.timezone,
            type: data.type,
            sizeX: Number(data.sizeX)
        };
        return this.http
            .put(uri, signs)
            .map(res => {
                return res;
            }
            );
    }

    deleteSign(id) {
        const uri = '/leddesigner/signsn/deleteSignSN?signId=' + id;
        return this.http
            .delete(uri)
            .map(res => {
                return res;
            }
            );
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
