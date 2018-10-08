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

  continuousCreate(data, file: File[]) {
    const uri = this.apiURL + 'leddesigner/schedule/continuous';
    // {"userid" : 4,"scheduleName":"mySchedule.yml","startDate" : "2018-08-01",
    // "endDate" : "2018-09-30","startTime" : "10:30","endTime" : "10:40","priority" : 1}
    // {"priority": 1,"scheduleName": "myFirstContinueSchedule.yml","startDate": "2018-01-02",
    // "endDate": "2018-01-01","startTime": "01:00","endTime": "01:00","userid": 5 }

    const scheduleData = '{' +
      '"priority": ' + Number(data.priority) + ',' +
      '"scheduleName": "' + data.name + '",' +
      '"startDate": "' + data.startdate + '",' +
      '"endDate": "' + data.enddate + '",' +
      '"startTime": "' + data.starttime + '",' +
      '"endTime": "' + data.endtime + '",' +
      '"userid": ' + Number(localStorage.getItem('userid')) + ' }';

    // this.schedule = scheduleData.toString();
    // console.log(scheduleData);
    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    this.formdata.append('file', file);
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
      }, error => {
        console.log(error);
      });


  }
}
