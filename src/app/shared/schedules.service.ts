import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

import { Config } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  apiURL = this.config.apiURL;
  formdata: any;
  constructor(private http: HttpClient, private config: Config) { }

  continuousCreate(data) {
    const uri = this.apiURL + 'leddesigner/schedule/continuous';
    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    this.formdata = new FormData();
    this.formdata.append('myfiles', data.myfiles);
    this.formdata.append('priority', data.priority);
    this.formdata.append('startdate', data.startdate);
    this.formdata.append('enddate', data.enddate);
    this.formdata.append('starttime', data.starttime);
    this.formdata.append('endtime', data.endtime);
    return this
      .http
      .post(uri, this.formdata, { params, headers })
      .map(res => {
        console.log(res);
        return res;
      });


  }
}
