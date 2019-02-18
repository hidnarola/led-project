import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

import { Config } from '../shared/config';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  apiURL = this.config.apiURL;
  formdata: any;
  scheduleData: string;
  // schedule: string;
  constructor(private http: HttpClient, private config: Config) { }

  convertToOnDate(date) {
    const dt = new Date(date);
    // console.log(date + ' : ' + dt.getDate() + '-' + dt.getMonth());
    return dt.getDate() + '-' + dt.getMonth();
  }
  timeToMS(strtime) {
    let ms = 0;
    const HH = strtime.split(':')[0] * 60 * 60 * 1000;
    const mm = strtime.split(':')[1] * 60 * 1000;
    const ss = strtime.split(':')[2] * 1000;
    ms = HH + mm + ss;
    return ms;
  }
  pad(n, width) {
    const z = '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  msToTime(s) {
    if (s) {
      const ms = s % 1000;
      s = (s - ms) / 1000;
      const secs = s % 60;
      s = (s - secs) / 60;
      const mins = s % 60;
      const hrs = (s - mins) / 60;

      return this.pad(hrs, 2) + ':' + this.pad(mins, 2) + ':' + this.pad(secs, 2);
    } else {
      return '';
    }
  }
  createSchedule(data, file: File[], type) {
    // const uri = this.apiURL + 'leddesigner/schedule/continuous';
    const uri = this.apiURL + 'leddesigner/schedule/add';

    // Continuous :
    // {"userid" : 1,"scheduleName" : "myContinuousSchedule.yml","firstYear" : 0,"lastYear" : 0,
    // "onDate" : "","startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40","moduloYDay" : 1,"moduloWeek" : 1,
    // "weekDays" : 127,"scheduleMonths" : 0,"scheduleMonthDays" : 0,"priority" : 3,
    // "type":"Continuous"}

    // {"userid" : 1,"scheduleName" : "myContinuousSchedule.yml",
    // "startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40",
    // "priority" : 3,"type":"Continuous"}

    // Daily :
    // {"userid" : 2,"scheduleName" : "myDailySchedule.yml",
    // "startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40","moduloYDay" : 2,"priority" : 7,
    // "type":"Daily"}

    // Weekly :
    // {"userid" : 3,"scheduleName" : "myWeeklySchedule.yml",
    // "startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40","moduloWeek" : 3,"weekDays" : 10,
    // "priority" : 4,"type":"Weekly"}

    // Monthly :
    // {"userid" : 4,"scheduleName" : "myMonthlySchedule.yml",
    // "startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40","weekDays" : 127,"scheduleMonths" : 10,"scheduleMonthDays" : 16777216,
    // "priority" : 9,"type":"Monthly"}

    // {"userid" : 4,"scheduleName" : "myMonthlySchedule.yml",
    // "startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40","weekDays" : 10,"scheduleMonths" : 10,"scheduleMonthDays" : 2147483647,
    // "priority" : 9,"type":"Monthly"}

    // Yearly :
    // {"userid" : 5,"scheduleName" : "myYearlySchedule.yml","firstYear" : 2018,"lastYear" : 2020,
    // "onDate" : "2018-08-01","startTime" : "10:30","endTime" : "10:40",
    // "priority" : 10,"type":"Yearly"}

    //  Default :
    // {"userid" : 4,"scheduleName" : "mySchedule.yml","firstYear" : 0,"lastYear" : 0,
    // "onDate" : "2018-09-30","startDate" : "2018-08-01","endDate" : "2018-09-30",
    // "startTime" : "10:30","endTime" : "10:40","moduloYDay" : 5,"moduloWeek" : 2,
    // "weekDays" : 2,"scheduleMonths" : 2,"scheduleMonthDays" : 3,"priority" : 1,
    // "type":"Continuous"}

    // *******OLDER ********
    // {"priority": 1,"scheduleName": "myFirstContinueSchedule.yml","startDate": "2018-01-02",
    // "endDate": "2018-01-01","startTime": "01:00","endTime": "01:00","userid": 5 }

    // '"startDate": "' + ((data.startDate) ? new Date(data.startDate) : '') + '",' +
    // '"endDate": "' + ((data.endDate) ? new Date(data.endDate) : '') + '",' +

    if (type === this.config.SCHE_CONT) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '.yml",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_DAYL) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '.yml",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"moduloYDay": ' + ((data.moduloYDay) ? data.moduloYDay : 0) + ',' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_WEEK) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '.yml",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"weekDays": [' + ((data.weekDays) ? data.weekDays : 7) + '],' +
        '"moduloWeek": ' + ((data.moduloWeek) ? data.moduloWeek : 0) + ',' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_MONT) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '.yml",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"scheduleMonthDays": ' + ((data.scheduleMonthDays) ? data.scheduleMonthDays : 31) + ',' +
        '"scheduleMonths": [' + ((data.scheduleMonths) ? data.scheduleMonths : '') + '],' +
        '"weekDays": [' + ((data.weekDays) ? data.weekDays : 7) + '],' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_YEAR) {
      // const onDate = this.convertToOnDate(data.onDate);
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '.yml",' +
        '"firstYear": "' + ((data.firstYear) ? data.firstYear : '') + '",' +
        '"lastYear": "' + ((data.lastYear) ? data.lastYear : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"onDate": "' + ((data.onDate) ? data.onDate : '') + '",' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else {
      this.scheduleData = '{}';

      // ******* ALL IN ONE ******
      // this.scheduleData = '{' +
      //   '"priority": ' + Number(data.priority) + ',' +
      //   '"scheduleName": "' + data.scheduleName + '",' +
      //   '"scheduleMonthDays": ' + ((data.scheduleMonthDays) ? data.scheduleMonthDays : 0) + ',' +
      //   '"scheduleMonths": ' + ((data.scheduleMonths) ? data.scheduleMonths : 0) + ',' +
      //   '"weekDays": ' + ((data.weekDays) ? data.weekDays : 0) + ',' +
      //   '"moduloWeek": ' + ((data.moduloWeek) ? data.moduloWeek : 0) + ',' +
      //   '"moduloYDay": ' + ((data.moduloYDay) ? data.moduloYDay : 0) + ',' +
      //   '"onDate": "' + ((data.onDate) ? data.onDate : '') + '",' +
      //   '"firstYear": "' + ((data.firstYear) ? data.firstYear : '') + '",' +
      //   '"lastYear": "' + ((data.lastYear) ? data.lastYear : '') + '",' +
      //   '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
      //   '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
      //   '"startTime": "' + data.startTime + '",' +
      //   '"endTime": "' + data.endTime + '",' +
      //   '"type": "' + type + '",' +
      //   '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    }


    // this.schedule = scheduleData.toString();
    // console.log(this.scheduleData);
    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    for (let i = 0; i < file.length; i++) {
      this.formdata.append('multipartFiles', file[i]);
    }
    // this.formdata.append('multipartFiles', file);
    console.log('file => ', file);
    let dura = '{"map":{';
    for (let i = 0; i < data.durationList.length; i++) {
      if (i < data.durationList.length - 1) {
        dura += '"' + data.durationList[i].name + '":"' + data.durationList[i].regex + '"' + ',';
      } else {
        dura += '"' + data.durationList[i].name + '":"' + data.durationList[i].regex + '"}}';
      }
    }
    let fileInfoStr = '{';
    for (let i = 0; i < data.fileInfo.length; i++) {
      if (i < data.fileInfo.length - 1) {
        fileInfoStr += '"' + data.fileInfo[i].name + '":"' + data.fileInfo[i].source + '"' + ',';
      } else {
        fileInfoStr += '"' + data.fileInfo[i].name + '":"' + data.fileInfo[i].source + '"}';
      }
    }

    this.formdata.append('scheduleStr', this.scheduleData);
    this.formdata.append('durationList', dura);
    this.formdata.append('fileinfoMapStr', fileInfoStr);

    return this
      .http
      .post(uri, this.formdata, { headers })
      .map(res => {
        // console.log(res);
        return res;
      }, error => {
        // console.log(error);
      });


  }

  updateSChedule(data, file: File[], type) {
    // const uri = this.apiURL + 'leddesigner/schedule/updateContinuous';
    const uri = this.apiURL + 'leddesigner/schedule/update';
    if (type === this.config.SCHE_CONT) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_DAYL) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"moduloYDay": ' + ((data.moduloYDay) ? data.moduloYDay : 0) + ',' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_WEEK) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"weekDays": [' + ((data.weekDays) ? data.weekDays : 0) + '],' +
        '"moduloWeek": ' + ((data.moduloWeek) ? data.moduloWeek : 0) + ',' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_MONT) {
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '",' +
        '"startDate": "' + ((data.startDate) ? data.startDate : '') + '",' +
        '"endDate": "' + ((data.endDate) ? data.endDate : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"scheduleMonthDays": ' + ((data.scheduleMonthDays) ? data.scheduleMonthDays : null) + ',' +
        '"scheduleMonths": [' + ((data.scheduleMonths) ? data.scheduleMonths : '') + '],' +
        '"weekDays": [' + ((data.weekDays) ? data.weekDays : '') + '],' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else if (type === this.config.SCHE_YEAR) {
      // const onDate = this.convertToOnDate(data.onDate);
      this.scheduleData = '{' +
        '"priority": ' + Number(data.priority) + ',' +
        '"scheduleName": "' + data.scheduleName + '",' +
        '"firstYear": "' + ((data.firstYear) ? data.firstYear : '') + '",' +
        '"lastYear": "' + ((data.lastYear) ? data.lastYear : '') + '",' +
        '"startTime": "' + data.startTime + '",' +
        '"endTime": "' + data.endTime + '",' +
        // '"duration": "' + this.timeToMS(data.duration) + '",' +
        '"onDate": "' + ((data.onDate) ? data.onDate : '') + '",' +
        '"type": "' + type + '",' +
        '"userid": ' + Number(localStorage.getItem('userid')) + ' }';
    } else {
      this.scheduleData = '{}';
    }

    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    for (let i = 0; i < file.length; i++) {
      this.formdata.append('multipartFiles', file[i]);
    }
    console.log('file => ', file);
    // this.formdata.append('multipartFiles', file);
    let dura = '{"map":{';
    for (let i = 0; i < data.durationList.length; i++) {
      if (i < data.durationList.length - 1) {
        dura += '"' + data.durationList[i].name + '":"' + data.durationList[i].regex + '"' + ',';
      } else {
        dura += '"' + data.durationList[i].name + '":"' + data.durationList[i].regex + '"}}';
      }
    }
    let fileInfoStr = '{';
    for (let i = 0; i < data.fileInfo.length; i++) {
      if (i < data.fileInfo.length - 1) {
        fileInfoStr += '"' + data.fileInfo[i].name + '":"' + data.fileInfo[i].source + '"' + ',';
      } else {
        fileInfoStr += '"' + data.fileInfo[i].name + '":"' + data.fileInfo[i].source + '"}';
      }
    }
    this.formdata.append('scheduleStr', this.scheduleData);
    this.formdata.append('durationList', dura);
    this.formdata.append('fileinfoMapStr', fileInfoStr);
    this.formdata.append('oldFileName', data.oldScheduleName);
    return this
      .http
      .post(uri, this.formdata, { headers })
      .map(res => {
        // console.log(res);
        return res;
      }, error => {
        // console.log(error.error.message);
      });
  }

  getSchedulesByUserId(userid) {
    // const uri = this.apiURL + 'leddesigner/schedule/getContinuousSchedulesByUserid?userid=' + userid;
    const uri = this.apiURL + 'leddesigner/schedule/getSchedulesByUserid?userid=' + userid;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  deleteScheduleById(id) {
    // const uri = this.apiURL + 'leddesigner/schedule/deleteContinuousSchedule?id=' + id;
    const uri = this.apiURL + 'leddesigner/schedule/delete?id=' + id;
    return this.http
      .delete(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getScheduleById(id) {
    // const uri = this.apiURL + 'leddesigner/schedule/getSelectedContinuousSchduleInfo?id=' + id;
    const uri = this.apiURL + 'leddesigner/schedule/getScheduleInfo?id=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getSchedules() {
    const uri = this.apiURL + 'leddesigner/schedule/getAllSchedules';

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  // from Delete Sign
  getScheduleBySignId(userid, signId) {
    const uri = this.apiURL + 'leddesigner/schedule/schedules?signId=' + signId + '&userid=' + userid;

    return this.http
      .get(uri)
      .map(res => {
        return res;
      }
      );

  }

  deleteScheduleByUserId(userid, data) {
    const uri = this.apiURL + 'leddesigner/schedule/deleteSchedule?userid=' + userid;

    const filedata = {
      entryIPList:
        data.entryIPList,
      filePropertiesList:
        data.filePropertiesList
    };
    return this.http
      .post(uri, filedata)
      .map(res => {
        return res;
      }
      );

  }


  getScheduleByUserIdandType(userid, type) {
    const uri = this.apiURL + 'leddesigner/schedule/getSchedulesByUseridAndType?userid=' + userid + '&type=' + type;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getFilesByUserId(userid) {
    const uri = this.apiURL + 'leddesigner/schedule/getFiles?userid=' + userid;
    // const uri = 'http://192.168.100.42:8081/leddesigner/schedule/getFiles?userid=' + userid;
    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  sendFileByUserId(data, uid) {
    // const uri = 'http://192.168.100.42:8081/leddesigner/schedule/send?userid=' + uid;
    const uri = this.apiURL + 'leddesigner/schedule/send?userid=' + uid;
    const filedata = {
      entryIPList:
        data.entryIPList,
      filePropertiesList:
        data.filePropertiesList
    };
    return this
      .http
      .post(uri, filedata)
      .map(res => {
        // console.log(res);
        return res;
      }, error => {
        // console.log(error);
      });

  }

  getImageForPreview(filename, userid) {
    const uri = this.apiURL + 'leddesigner/schedule/filePreview?fileName=' + filename + '&userid=' + userid;
    // const uri = 'http://192.168.100.42:8080/leddesigner/schedule/filePreview?fileName=blog-website-banner.jpg&userid=7';
    return this.http
      .get(uri
        // , { responseType: 'blob' }
        , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getAnimationLibrary() {
    // const uri = this.apiURL + 'leddesigner/schedule/allmovies';
    const uri = this.apiURL + 'leddesigner/schedule/getallvideos';
    return this.http
      .get(uri
        // , { responseType: 'blob' }
        // , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getImageLibrary() {
    const uri = this.apiURL + 'leddesigner/schedule/getallimages';
    return this.http
      .get(uri
        // , { responseType: 'blob' }
        // , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getImageFromUrl(url) {

    return this.http
      .get(url
        // , { responseType: 'blob' }
        , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  getMyImages(id) {
    const uri = this.apiURL + 'leddesigner/schedule/myimages?id=' + id;
    return this.http
      .get(uri
        // , { responseType: 'blob' }
        // , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }
  getMyAnimations(id) {
    const uri = this.apiURL + 'leddesigner/schedule/mymovies?id=' + id;
    return this.http
      .get(uri
        // , { responseType: 'blob' }
        // , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  uploadImage(file) {

    const uri = this.apiURL + 'leddesigner/schedule/uploadAllImages';

    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    this.formdata.append('file', file);
    return this
      .http
      .post(uri, this.formdata, { headers })
      .map(res => {
        // console.log(res);
        return res;
      });
  }

  uploadAnimation(file) {

    const uri = this.apiURL + 'leddesigner/schedule/uploadAllMovies';

    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    this.formdata.append('file', file);
    return this
      .http
      .post(uri, this.formdata, { headers })
      .map(res => {
        // console.log(res);
        return res;
      });
  }

  addForPreview(file) {
    const uri = this.apiURL + 'leddesigner/schedule/addPreview';

    const headers = new HttpHeaders();
    // this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    this.formdata = new FormData();
    this.formdata.append('file', file);
    return this
      .http
      .post(uri, this.formdata, { headers })
      .map(res => res);
  }
  getForPreview(filename) {
    const uri = this.apiURL + 'leddesigner/schedule/addfilePreview?fileName=' + filename;

    return this.http
      .get(uri
        // , { responseType: 'blob' }
        , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }
  previewTests(filename, source) {
    const uri = this.apiURL + 'leddesigner/schedule/addfilePreview1?fileName=' + filename +
      '&UserId=' + Number(localStorage.getItem('userid')) + '&Source=' + source;

    return this.http
      .get(uri
        // , { responseType: 'blob' }
        , { responseType: 'arraybuffer' }
      )
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }
  // Functions
  getValueOfScheduleMonthDays(days) {
    let day = 0;
    for (let i = 0; days !== 1; i++) {
      // // console.log('days: ' + days);
      days = days / 2;
      day++;
    }
    return day;
  }

}
