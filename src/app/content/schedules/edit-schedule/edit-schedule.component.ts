import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';

import { NotifierService } from 'angular-notifier';
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
    // this.model.monthorweek = 'week';
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
        let month = ('0' + this.model.startDate.monthValue).slice(-2);
        let date = ('0' + this.model.startDate.dayOfMonth).slice(-2);
        this.model.startDate = year + '-' + month + '-' + date;
        year = this.model.endDate.year;
        month = ('0' + this.model.endDate.monthValue).slice(-2);
        date = ('0' + this.model.endDate.dayOfMonth).slice(-2);
        this.model.endDate = year + '-' + month + '-' + date;
        // Set Time to Time Picker
        let HH = ('0' + this.model.startTime.hour).slice(-2);
        let MM = ('0' + this.model.startTime.minute).slice(-2);
        this.model.startTime = HH + ':' + MM;
        HH = ('0' + this.model.endTime.hour).slice(-2);
        MM = ('0' + this.model.endTime.minute).slice(-2);
        this.model.endTime = HH + ':' + MM;
        if (this.repeat === this.CONFIG.SCHE_WEEK || this.repeat === this.CONFIG.SCHE_MONT) {
          if (this.model.weekDays.length > 0) {
            this.model.weekDays = this.model.weekDays.toString().split(',');
            this.model.monthorweek = 'week';
          } else {
            this.model.monthorweek = 'month';
          }
          if (this.repeat === this.CONFIG.SCHE_MONT) { this.model.scheduleMonths = this.model.scheduleMonths.toString().split(','); }
        } else if (this.repeat === this.CONFIG.SCHE_YEAR) {
          const now = new Date();
          now.setDate(this.model.scheduleMonthDays - 1);
          now.setMonth(this.model.scheduleMonths[0] - 1);
          this.model.onDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) +
            '-' + ('0' + (now.getDate())).slice(-2);
        }
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

    // if (this.repeat === this.config.SCHE_CONT) {
    if (this.model.monthorweek === 'week') {
      this.model.weekDays = this.model.weekDays;
      this.model.scheduleMonthDays = 0;
    } else {
      this.model.weekDays = [];
    }
    this.service.updateSChedule(this.model, this.fileToUpload, this.repeat).subscribe(res => {
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
    // } else {
    //   console.log(this.repeat);
    //   console.log(this.model);
    // }
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
