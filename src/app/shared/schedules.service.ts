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
  // schedule: string;
  constructor(private http: HttpClient, private config: Config) { }

  continuousCreate(data) {
    const uri = this.apiURL + 'leddesigner/schedule/continuous';
    // {"userid" : 3,"startDate" : "2018-08-01","endDate" : "2018-09-30","startTime" : "10:30","endTime" : "10:40","priority" : 1}
    const scheduleData = '{' +
      '"priority": "' + data.priority + '",' +
      '"startdate": "' + data.startdate + '",' +
      '"enddate": "' + data.enddate + '",' +
      '"starttime": "' + data.starttime + '",' +
      '"endtime": "' + data.endtime + '",' +
      '"userid": "' + data.userid + '" }';

    // this.schedule = scheduleData.toString();
    console.log(scheduleData);
    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    this.formdata.append('file', data.myfiles);
    this.formdata.append('scheduleStr', scheduleData);
    // this.formdata.append('priority', data.priority);
    // this.formdata.append('startdate', data.startdate);
    // this.formdata.append('enddate', data.enddate);
    // this.formdata.append('starttime', data.starttime);
    // this.formdata.append('endtime', data.endtime);
    return this
      .http
      .post(uri, this.formdata, { headers })
      .map(res => {
        console.log(res);
        return res;
      });


  }
}
