import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../shared/config';


@Injectable({
    providedIn: 'root'
})
export class SchedulesService {
    formdata;
    constructor(
        private http: HttpClient,
        private config: Config
    ) { }

    convertToOnDate(date) {
        const dt = new Date(date);
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
    createSchedule(data, file, type) {
        const uri = '/leddesigner/schedule/add';
        const scheduleJSON = this.getScheduleRequestJSON(data, type);
        const headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.formdata = new FormData();
        for (let i = 0; i < file.length; i++) {
            this.formdata.append('multipartFiles', file[i], data['fileInfo'][i]['name']);
        }
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

        this.formdata.append('scheduleStr', JSON.stringify(scheduleJSON));
        this.formdata.append('durationList', dura);
        this.formdata.append('fileinfoMapStr', fileInfoStr);

        return this.http.post(uri, this.formdata, { headers });
    }

    updateSChedule(data, file, type) {
        const uri = '/leddesigner/schedule/update';
        const scheduleJSON = this.getScheduleRequestJSON(data, type);
        scheduleJSON['userid'] = data['userid'];
        const headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.formdata = new FormData();
        for (let i = 0; i < file.length; i++) {
            this.formdata.append('multipartFiles', file[i], file[i]['name']);
        }
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
        this.formdata.append('scheduleStr', JSON.stringify(scheduleJSON));
        this.formdata.append('durationList', dura);
        this.formdata.append('fileinfoMapStr', fileInfoStr);
        this.formdata.append('oldFileName', data.oldScheduleName);
        return this.http.post(uri, this.formdata, { headers });
    }

    getScheduleRequestJSON(data, type) {
        const scheduleJSON = {
            'priority': Number(data.priority),
            'scheduleName': data.scheduleName,
            'startDate': ((data.startDate) ? data.startDate : ''),
            'endDate': ((data.endDate) ? data.endDate : ''),
            'startTime': data.startTime,
            'endTime': data.endTime,
            'type': type,
            'userid': Number(localStorage.getItem('userid')),
            'scheduleId': data.scheduleId
        };
        if (type === this.config.SCHE_DAYL) {
            scheduleJSON['moduloYDay'] = ((data.moduloYDay) ? data.moduloYDay : 0);
        } else if (type === this.config.SCHE_WEEK) {
            scheduleJSON['moduloWeek'] = ((data.moduloWeek) ? data.moduloWeek : 0);
            scheduleJSON['weekDays'] = ((data.weekDays) ? data.weekDays : 0);
        } else if (type === this.config.SCHE_MONT) {
            scheduleJSON['scheduleMonthDays'] = ((data.scheduleMonthDays) ? data.scheduleMonthDays : null);
            scheduleJSON['scheduleMonths'] = ((data.scheduleMonths) ? data.scheduleMonths : '');
            scheduleJSON['weekDays'] = ((data.weekDays) ? data.weekDays : '');
        } else if (type === this.config.SCHE_YEAR) {
            scheduleJSON['firstYear'] = ((data.firstYear) ? data.firstYear : '');
            scheduleJSON['lastYear'] = ((data.lastYear) ? data.lastYear : '');
            scheduleJSON['onDate'] = ((data.onDate) ? data.onDate : '');
        }
        return scheduleJSON;
    }

    getSchedulesByUserId(userid) {
        const uri = '/leddesigner/schedule/getSchedulesByUserid?userid=' + userid;
        return this.http.get(uri);
    }

    deleteScheduleById(id) {
        const uri = '/leddesigner/schedule/delete?id=' + id;
        return this.http.delete(uri);
    }

    getScheduleById(id) {
        const uri = '/leddesigner/schedule/getScheduleInfo?id=' + id;
        return this.http.get(uri);
    }

    getSchedules() {
        const uri = '/leddesigner/schedule/getAllSchedules';
        return this.http.get(uri);
    }

    getScheduleBySignId(userid, signId) {
        const uri = '/leddesigner/schedule/schedules?signId=' + signId + '&userid=' + userid;
        return this.http.get(uri);
    }

    deleteScheduleByUserId(userid, data) {
        const uri = '/leddesigner/schedule/deleteSchedule?userid=' + userid;

        const filedata = {
            entryIPList: data.entryIPList,
            filePropertiesList: data.filePropertiesList
        };
        return this.http.post(uri, filedata);
    }

    // unused API 

    // getScheduleByUserIdandType(userid, type) {
    //     const uri = '/leddesigner/schedule/getSchedulesByUseridAndType?userid=' + userid + '&type=' + type;
    //     return this.http.get(uri);
    // }

    getFilesByUserId(userid) {
        const uri = '/leddesigner/schedule/getFiles?userid=' + userid;
        return this.http.get(uri);
    }

    sendFileByUserId(data, uid) {
        const uri = '/leddesigner/schedule/send?userid=' + uid;
        const filedata = {
            entryIPList: data.entryIPList,
            filePropertiesList: data.filePropertiesList
        };
        return this.http.post(uri, filedata);
    }

    getImageForPreview(filename, userid) {
        const httpOptions = {};
        httpOptions['responseType'] = 'Blob' as 'json';
        httpOptions['observe'] = 'response';

        const uri = '/leddesigner/schedule/filePreview?fileName=' + filename + '&userid=' + userid;
        return this.http.get(uri, httpOptions);
    }

    getAnimationLibrary() {
        const uri = '/leddesigner/schedule/getallvideos';
        return this.http.get(uri);
    }

    getImageLibrary() {
        const uri = '/leddesigner/schedule/getallimages';
        return this.http.get(uri);
    }

    getImageFromUrl(url) {
        const httpOptions = {};
        httpOptions['responseType'] = 'Blob' as 'json';
        httpOptions['observe'] = 'response';
        return this.http.get(url, httpOptions);
    }

    getMyImages(id) {
        const uri = '/leddesigner/schedule/myimages?id=' + id;
        return this.http.get(uri);
    }
    getMyAnimations(id) {
        const uri = '/leddesigner/schedule/mymovies?id=' + id;
        return this.http.get(uri);
    }

    uploadImage(file) {
        const uri = '/leddesigner/schedule/uploadAllImages';
        const headers = new HttpHeaders();
        // this is the important step. You need to set content type as null
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.formdata = new FormData();
        this.formdata.append('file', file);
        return this.http.post(uri, this.formdata, { headers });
    }

    uploadAnimation(file) {
        const uri = '/leddesigner/schedule/uploadAllMovies';
        const headers = new HttpHeaders();
        // this is the important step. You need to set content type as null
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.formdata = new FormData();
        this.formdata.append('file', file);
        return this.http.post(uri, this.formdata, { headers });
    }

    addForPreview(file) {
        const uri = '/leddesigner/schedule/addPreview';
        const headers = new HttpHeaders();
        // this is the important step. You need to set content type as null
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.formdata = new FormData();
        this.formdata.append('file', file);
        return this.http.post(uri, this.formdata, { headers });
    }

    getPriview(filename, source) {
        const httpOptions = {};
        httpOptions['responseType'] = 'Blob' as 'json';
        httpOptions['observe'] = 'response';
        const uri = '/leddesigner/schedule/preview-file?fileName=' + filename + '&source=' + source;
        return this.http.get(uri, httpOptions);
    }
    // Functions
    getValueOfScheduleMonthDays(days) {
        let day = 0;
        for (let i = 0; days !== 1; i++) {
            days = days / 2;
            day++;
        }
        return day;
    }


    uploadFile(file: File) {
        const uri = '/leddesigner/schedule/upload-file';
        const headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.formdata = new FormData();
        this.formdata.append('multipartFile', file);
        return this.http.post(uri, this.formdata, { headers });
    }

    blobToFile(theBlob, fileName): File {
        const b: any = theBlob;
        b.lastModified = Date.now();
        b.name = fileName;
        return <File>theBlob;
    }
}
