import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';

import { NotifierService } from 'angular-notifier';
import { timestamp } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {
  user_name: string;
  user_role: string;
  repeat = 'None';
  years = [];
  files = [];
  myfile: any;
  fileToUpload: File[] = [];
  res: any;
  imageUrl = '/assets/images/signature.png';
  isPreview: boolean;
  model: any = {};
  CONFIG = this.config;
  constructor(private notifier: NotifierService, private route: ActivatedRoute,
    private service: SchedulesService, private router: Router,
    private config: Config) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('user_role')).replace('ROLE_', '');
    this.model.monthorweek = 'week';
    this.model.myfiles = [];
    for (let i: any = new Date().getFullYear(); this.years.length < 100; i++) {
      // console.log(this.years.length + ' : ' + i);
      this.years.push({ 'value': i });
    }
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.service.getScheduleById(params['id']).subscribe(res => {
        this.res = res;
        this.repeat = this.res.type;
        this.model = this.res.schduleDTO;
        this.files = this.res.multipartImages;
        // Set Date to datepicker
        let year = this.model.startDate.year;
        let month = (this.model.startDate.monthValue > 9)
          ? this.model.startDate.monthValue - 1 : '0' + (this.model.startDate.monthValue - 1);
        let date = (this.model.startDate.dayOfMonth > 9)
          ? this.model.startDate.dayOfMonth : '0' + this.model.startDate.dayOfMonth;
        this.model.startDate = year + '-' + month + '-' + date;
        year = this.model.endDate.year;
        month = (this.model.endDate.monthValue > 9)
          ? this.model.endDate.monthValue - 1 : '0' + (this.model.endDate.monthValue - 1);
        date = (this.model.endDate.dayOfMonth > 9)
          ? this.model.endDate.dayOfMonth : '0' + this.model.endDate.dayOfMonth;
        this.model.endDate = year + '-' + month + '-' + date;
        // Set Time to Time Picker
        let HH = this.model.startTime.hour > 9 ? this.model.startTime.hour : '0' + this.model.startTime.hour;
        let MM = this.model.startTime.minute > 9 ? this.model.startTime.minute : '0' + this.model.startTime.minute;
        this.model.startTime = HH + ':' + MM;
        HH = this.model.endTime.hour > 9 ? this.model.endTime.hour : '0' + this.model.endTime.hour;
        MM = this.model.endTime.minute > 9 ? this.model.endTime.minute : '0' + this.model.endTime.minute;
        this.model.endTime = HH + ':' + MM;

        console.log(this.res.schduleDTO);

      });
    });
    // document.getElementById('mydate').value = '2001-01-10';
  }

  handleFileInput(file: FileList) {
    let isMatched = false;
    if (this.fileToUpload.length > 0 && file.length > 0) {
      this.fileToUpload.forEach(files => {
        if (file.item(0).name === files.name) {
          console.log('matched');
          this.notifier.notify('info', 'Rename Filename if you want to add');
          this.notifier.notify('warning', 'Same File Name Exist.');
          isMatched = true;
        }
      });
    } else {
      isMatched = true;
      if (file.length > 0) {
        this.fileToUpload.push(file.item(0));
      } else {
        this.notifier.notify('info', 'No File Selected');
      }
    }
    if (!isMatched) {
      if (file.length > 0) {
        this.fileToUpload.push(file.item(0));
      } else {
        this.notifier.notify('info', 'No File Selected');
      }
      isMatched = false;
    }
    console.log(this.fileToUpload);
  }

  showImagePreview(file: File) {
    this.isPreview = true;
    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  deleteImage(index) {
    this.fileToUpload.splice(index, 1);
    this.isPreview = false;
    this.myfile = '';
  }

  onSubmit() {

    // console.log(this.model);

    if (this.repeat === this.config.SCHE_CONT) {
      this.service.updateContiSChedule(this.model, this.fileToUpload).subscribe(res => {
      }, error => {
        if (error.status === 200) {
          this.notifier.notify('success', 'Scheduled Updated Successfully');
          this.model = {};
          this.fileToUpload = [];
          this.router.navigate(['/schedules']);
        } else if (error.status === 400) {
          this.notifier.notify('warning', 'Select Image To upload');
        } else {
          this.notifier.notify('error', error.error.message);
        }
      });
    } else {
      console.log(this.repeat);
      console.log(this.model);
    }
  }

  convertToDate(day, mon, yr) {
    const date = new Date();
    date.setFullYear(yr, mon, day);
    return date;
    // return yr + '-' + mon + '-' + day;
  }

  convertToTime(HH, MM, SS) {
    const time = new Date();
    time.setHours(HH, MM, SS);
    return time;
  }

}
