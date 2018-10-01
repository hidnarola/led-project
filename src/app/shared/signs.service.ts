import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

import { Config } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class SignsService {
  apiURL = this.config.apiURL;
  constructor(private http: HttpClient, private config: Config) { }

  getAllSigns() {
    const uri = this.apiURL + 'leddesigner/signsn/getAllSignSN';

    return this.http
      .get(uri)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }
      ));
  }

  getSingleSign(id) {
    const uri = this.apiURL + 'leddesigner/signsn/getSignSN?signId=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }
      ));
  }

  addSign(data) {
    const uri = this.apiURL + 'leddesigner/signsn/add';
    const signs = {
      height: Number(data.heighty),
      host: data.ip,
      name: data.signname,
      port: Number(data.port),
      status: true,
      timezone: new Date().toLocaleString,
      type: data.signtype,
      width: Number(data.widthx)
    };

    // timezone: data.timezone,
    return this.http
      .post(uri, signs)
      .map(res => {
        // console.log(res);
        return res;
      }
      );
  }

  updateSign(data) {
    const uri = this.apiURL + 'leddesigner/signsn/updateSignSN';
    const signs = {
      height: data.height,
      host: data.host,
      id: data.id,
      name: data.name,
      port: data.port,
      status: true,
      timezone: data.timezone,
      type: data.type,
      width: data.width
    };
    return this.http
      .put(uri, signs)
      .map(res => {
        // console.log(res);
        return res;
      }
      );
  }

  deleteSign(id) {
    const uri = this.apiURL + 'leddesigner/signsn/deleteSignSN?signId=' + id;
    return this.http
      .delete(uri)
      .map(res => {
        // console.log(res);
        return res;
      }
      );
  }

}
