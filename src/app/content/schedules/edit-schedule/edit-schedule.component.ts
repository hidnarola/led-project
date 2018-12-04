import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';

import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

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
  imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
  model: any = {};
  CONFIG = this.config;
  isPreviewImage: boolean;
  isPreviewObject: boolean;
  isPreviewVideo: boolean;
  videoType: string;
  constructor(private notifier: NotifierService, private route: ActivatedRoute,
    private service: SchedulesService, private router: Router,
    private config: Config, private sanitizer: DomSanitizer, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('user_role')).replace('ROLE_', '');
    // this.model.monthorweek = 'week';
    this.spinner.show();
    this.model.myfiles = [];
    for (let i: any = new Date().getFullYear(); this.years.length < 100; i++) {
      // // console.log(this.years.length + ' : ' + i);
      this.years.push({ 'value': i });
    }
    this.route.params.subscribe(params => {
      // // console.log(params['id']);
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
        // console.log(this.res.schduleDTO);
        this.spinner.hide();
      }, error => {
        this.notifier.notify('error', error.error.message);
        console.log(error.error.message);
        this.spinner.hide();
        this.router.navigate(['/user/schedules']);
      });
    });
    // document.getElementById('mydate').value = '2001-01-10';
  }

  handleFileInput(file: FileList) {
    let isMatched = false;
    if (this.fileToUpload.length > 0 && file.length > 0) {
      this.fileToUpload.forEach(files => {
        if (file.item(0).name === files.name) {
          // console.log('matched');
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
    // console.log(this.fileToUpload);
  }

  // imagePreview(filename) {
  //   this.isPreview = true;
  //   this.service.getImageForPreview(filename, localStorage.getItem('userid')).subscribe(res => {
  //     // console.log(res);
  //     const blob = new Blob([res], { type: 'image/png' });
  //     this.showImagePreview(blob);
  //   });
  // }

  imagePreview(filename) {
    // this.isPreview = true;
    this.spinner.show();
    this.service.getImageForPreview(filename, localStorage.getItem('userid')).subscribe(res => {
      // console.log(res);
      const uint = new Uint8Array(res.slice(0, 4));
      const bytes = [];
      uint.forEach((byte) => {
        bytes.push(byte.toString(16));
      });
      const hex = bytes.join('').toUpperCase();
      const binaryFileType = this.getMimetype(hex);
      // console.log(binaryFileType + ' ' + hex);
      if (binaryFileType === 'Unknown filetype') {
        this.notifier.notify('warning', 'Unknown File Type or Currupted File');
      } else {
        const file = new Blob([new Uint8Array(res)], { type: binaryFileType });
        this.showImagePreview(file);
      }
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  // showImagePreview(file) {
  //   this.isPreview = true;
  //   // Show image preview
  //   const reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.imageUrl = event.target.result;
  //   };
  //   reader.readAsDataURL(file);
  // }

  showImagePreview(file: Blob) {
    this.spinner.show();
    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      if (file.type.substr(0, 5) === 'video') {
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = true;
        this.videoType = file.type;
        // console.log('video file selected');
      } else if (file.type.substr(0, 5) === 'image') {
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
        this.isPreviewImage = true;
        // console.log('Image file selected');
      } else {
        this.isPreviewVideo = false;
        this.isPreviewImage = false;
        this.isPreviewObject = true;
        // console.log('Animation file selected');
      }
      this.spinner.hide();
      // window.open(event.target.result, '_blank');
      // console.log(this.imageUrl);
    };
    reader.readAsDataURL(file);
    // reader.readAsBinaryString(file);
  }


  deleteImage(index) {
    this.fileToUpload.splice(index, 1);
    this.isPreviewImage = false;
    this.isPreviewVideo = false;
    this.isPreviewObject = false;
    this.myfile = '';
  }

  onSubmit() {
    this.spinner.show();
    // // console.log(this.model);

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
        this.spinner.hide();
        this.router.navigate(['/schedules']);
      } else if (error.status === 400) {
        this.notifier.notify('warning', 'Select Image To upload');
      } else {
        this.notifier.notify('error', error.error.message);
      }
      this.spinner.hide();
    });

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
  getMimetype = (signature) => {
    switch (signature) {
      case '89504E47':
        return 'image/png';
      case '47494638':
        return 'image/gif';
      case 'FFD8FFDB':
      case 'FFD8FFE0':
      case 'FFD8FFE1':
        return 'image/jpeg';
      case '3C3F786D':
        return 'image/svg+xml';
      case '00018':
      case '0001C':
        return 'video/mp4';
      case '1A45DFA3':
        return 'video/webm';
      case '4357539':
        return 'application/x-shockwave-flash';
      case '504B0304':
      case '504B34':
        return 'application/zip';
      case '25504446':
        return 'application/pdf';
      default:
        return 'Unknown filetype';
    }
  }


}
