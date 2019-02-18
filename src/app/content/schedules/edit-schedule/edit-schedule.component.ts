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
  oldScheduleName: string;
  ms24 = 86400000;
  durationList: any = [];
  myAnimationFile: boolean;
  myImageFile: boolean;
  animationLibraryFile: boolean;
  imageLibraryFile: boolean;
  myFile: boolean;
  rootFile: boolean;
  libraryFile: boolean;
  display = false;
  fileExplorer: any;
  fileNamesList: any = [];
  currentYear = Number(new Date().getFullYear());
  user_name: string;
  user_role: string;
  repeat = 'None';
  years = [];
  files = [];
  fileInfoStr: any = [];
  fileInfo: any = [];
  myfile: any;
  // fileToUpload: File[] = [];
  fileToUpload: any[] = [];
  filesToUpload: any[] = [];
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
        console.log('this.res => ', this.res);
        this.repeat = this.res.type;
        this.model = this.res.schduleDTO;
        this.files = this.res.multipartImages;
        console.log('files => ', this.files);
        this.files.forEach(file => {
          this.fileInfoStr.push({ name: file.path, source: 'folder' });
        });
        this.oldScheduleName = this.res.schduleDTO.scheduleName;
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
        this.model.duration = this.msToTime(this.model.duration);
        // console.log('this.model => ', res);
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

  myFolder_click() {
    this.myFile = true;
    this.rootFile = false;
    this.myImageFile = false;
    this.myAnimationFile = false;
  }
  showDialog() {
    this.display = true;
    this.rootFiles();
  }
  myLibrary_click() {
    this.libraryFile = true;
    this.rootFile = false;
    this.imageLibraryFile = false;
    this.animationLibraryFile = false;
  }
  rootFiles() {
    this.rootFile = true;
    this.libraryFile = false;
    this.myFile = false;
    this.imageLibraryFile = false;
    this.animationLibraryFile = false;
    this.myImageFile = false;
    this.myAnimationFile = false;
  }
  ImageLibrary() {
    this.libraryFile = false;
    this.imageLibraryFile = true;
  }
  AnimationLibrary() {
    this.libraryFile = false;
    this.animationLibraryFile = true;
  }
  myImage() {
    this.myFile = false;
    this.myImageFile = true;
  }
  myAnimation() {
    this.myFile = false;
    this.myAnimationFile = true;
  }

  getMyImagesLibrary() {
    this.myImage();
    this.spinner.show();
    this.service.getMyImages(localStorage.getItem('userid')).subscribe(res => {
      this.fileExplorer = [];
      this.fileExplorer = res;
      // console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getMyAnimationLibrary() {
    this.myAnimation();
    this.spinner.show();
    this.service.getMyAnimations(localStorage.getItem('userid')).subscribe(res => {
      this.fileExplorer = [];
      this.fileExplorer = res;
      console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getImageLibrary() {
    this.ImageLibrary();
    this.spinner.show();
    this.service.getImageLibrary().subscribe(res => {
      this.fileExplorer = [];
      this.fileExplorer = res;
      // console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getAnimationLibrary() {
    this.AnimationLibrary();
    this.spinner.show();
    this.service.getAnimationLibrary().subscribe(res => {
      this.fileExplorer = [];
      this.fileExplorer = res;
      console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  pickFile(file, filename, source) {
    // console.log(this.dataURItoBlob(base64));
    // this.handleFileInput(base64);
    // this.handleFileInput(this.blobToFile(this.dataURItoBlob(base64), filename));
    // this.handleFileInput(new File(this.dataURItoBlob(base64), 'uploaded_file.jpg', { type: 'image/jpeg', lastModified: Date.now() }));
    // this.fileToUpload.push(this.blobToFile(this.dataURItoBlob(base64), filename));
    // console.log(this.blobToFile(this.dataURItoBlob(base64), filename));
    this.service.getImageFromUrl(file).subscribe(res => {
      // const Image = new File([res], filename);
      // this.handleFileInput(res);
      // console.log('res => ', res);

      const uint = new Uint8Array(res.slice(0, 4));
      const bytes = [];
      uint.forEach((byte) => {
        bytes.push(byte.toString(16));
      });
      const hex = bytes.join('').toUpperCase();
      const binaryFileType = this.getMimetype(hex);
      console.log(binaryFileType + ' ' + hex);
      if (binaryFileType === 'Unknown filetype') {
        this.notifier.notify('warning', 'Unknown File Type or Currupted File');
      } else {
        // const file = new Blob([new Uint8Array(res)], { type: binaryFileType });
        const Image = new File([res], filename, { type: binaryFileType });
        this.handleFileInput(Image, source);
        // console.log('1 => ', 1);
      }


    }, error => {
      if (error.status === 200) {
        // const Image = new File([error.error.text], filename, { type: 'image/png' });
        // this.handleFileInput(Image);
        console.log('error with success => ', error);
      } else {
        console.log('error => ', error);
      }
    });

  }
  // handleFileInput(file: FileList) {
  //   let isMatched = false;
  //   if (this.fileToUpload.length > 0 && file.length > 0) {
  //     this.fileToUpload.forEach(files => {
  //       if (file.item(0).name === files.name) {
  //         // console.log('matched');
  //         this.notifier.notify('info', 'Rename Filename if you want to add');
  //         this.notifier.notify('warning', 'Same File Name Exist.');
  //         isMatched = true;
  //       }
  //     });
  //   } else {
  //     isMatched = true;
  //     if (file.length > 0) {
  //       this.fileToUpload.push(file.item(0));
  //     } else {
  //       this.notifier.notify('info', 'No File Selected');
  //     }
  //   }
  //   if (!isMatched) {
  //     if (file.length > 0) {
  //       this.fileToUpload.push(file.item(0));
  //     } else {
  //       this.notifier.notify('info', 'No File Selected');
  //     }
  //     isMatched = false;
  //   }
  //   // console.log(this.fileToUpload);
  // }

  // imagePreview(filename) {
  //   this.isPreview = true;
  //   this.service.getImageForPreview(filename, localStorage.getItem('userid')).subscribe(res => {
  //     // console.log(res);
  //     const blob = new Blob([res], { type: 'image/png' });
  //     this.showImagePreview(blob);
  //   });
  // }

  handleFileInput(file, source) {
    this.spinner.show();
    // let isMatched = false;
    // console.log('this.fileNamesList.indexOf(file.name) => ', this.fileNamesList.indexOf(file.name));
    if (this.fileNamesList.indexOf(file.name) >= 0) {
      this.notifier.notify('warning', 'Same File Name Exist.');
      // isMatched = true;
    } else {
      file.duration = '00:00:06';
      this.fileToUpload.push(file);
      this.fileNamesList.push(file.name);
      if (file.type.substr(0, 5) === 'video' && source === 'PC') {
        this.service.addForPreview(file).subscribe(res => {
          console.log('addForPreview -> res => ', res);
          this.spinner.hide();
        }, error => {
          console.log('addForPreview -> error => ', error);
          this.spinner.hide();
        });
      }
      this.spinner.hide();
      this.fileInfo.push({ 'name': file.name, 'source': source });
      // this.filesToUpload = file;
      // this.notifier.notify('info', 'Unique.');
      // isMatched = false;
    }
    // this.fileToUpload.forEach(files => {
    //   if (file.name === files.name) {
    //     // console.log('matched');
    //     // this.notifier.notify('info', 'Rename Filename if you want to add');
    //   }
    // });
    // }
    // else {
    // isMatched = true;
    // if (file.length > 0) {
    // this.fileToUpload.push(file.item(0));
    // this.filesToUpload = file;
    // } else {
    // this.notifier.notify('info', 'No File Selected');
    // }
    // }
    // if (!isMatched) {
    //   if (file) {
    //     this.fileToUpload.push(file);
    //     this.fileNamesList.push(file.name);
    //     this.filesToUpload = file;
    //   } else {
    //     this.notifier.notify('info', 'No File Selected');
    //   }
    //   isMatched = false;
    // }

    // console.log(this.fileToUpload);
    this.display = false;
    // console.log(this.filesToUpload);
  }
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
      console.log(error.error);
      this.notifier.notify('error', error.error);
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
  getConvertedFile(filename) {
    this.service.getForPreview(filename).subscribe(res => {
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
    },
      error => {
        console.log('getConvertedFile: Eroor => ', error);
      });
  }
  showImagePreview(file: Blob) {
    this.spinner.show();
    this.isPreviewVideo = false;
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
    this.fileNamesList.splice(index, 1);
    this.fileInfo.splice(index, 1);
    this.isPreviewImage = false;
    this.isPreviewVideo = false;
    this.isPreviewObject = false;
    this.myfile = '';
  }
  edeleteImage(index) {
    this.files.splice(index, 1);
    this.fileInfoStr.splice(index, 1);
  }
  timeToMS(strtime) {
    let ms = 0;
    const HH = strtime.split(':')[0] * 60 * 60 * 1000;
    const mm = strtime.split(':')[1] * 60 * 1000;
    const ss = strtime.split(':')[2] * 1000;
    ms = HH + mm + ss;
    return ms;
  }
  onSubmit() {
    this.spinner.show();

    if (this.model.monthorweek === 'week') {
      this.model.weekDays = this.model.weekDays;
      this.model.scheduleMonthDays = 0;
    } else {
      this.model.weekDays = [];
    }
    this.durationList = [];

    this.fileToUpload.forEach(file => {
      const dura: any = {};
      dura.name = file.name;
      dura.regex = this.timeToMS(file.duration);
      this.durationList.push(dura);
    });
    this.fileInfo.forEach(file => {
      this.fileInfoStr.push({ 'name': file.name, 'source': file.source });
    });
    this.model.durationList = this.durationList;
    this.model.oldScheduleName = this.oldScheduleName;
    this.uniqueArray(this.fileInfoStr);
    this.model.fileInfo = this.fileInfoStr;
    console.log('this.model => ', this.model);
    this.service.updateSChedule(this.model, this.fileToUpload, this.repeat).subscribe(res => {
      console.log('res => ', res);
      this.spinner.hide();
    }, error => {
      if (error.status === 200) {
        this.notifier.notify('success', 'Scheduled Updated Successfully');
        this.model = {};
        this.fileToUpload = [];
        this.spinner.hide();
        this.router.navigate(['/user/schedules']);
      } else if (error.status === 400) {
        this.notifier.notify('warning', 'Select Image To upload');
      } else {
        this.notifier.notify('error', error.error.message);
      }
      // this.notifier.notify('error', error);
      this.spinner.hide();
    });

  }
  uniqueArray = (values) => values.filter((v, i) => values.indexOf(v) === i);
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
      case '00020':
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
