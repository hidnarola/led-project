import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Config } from '../../../shared/config';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SchedulesService } from '../../../shared/schedules.service';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
// import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
// declare var jwplayer: any;
// declare var videojs: any;
import { DateTime } from 'luxon';
import { stringify } from '@angular/compiler/src/util';
@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  ms24 = 86400000;
  durationList: any = [];
  // private videoJSplayer: any;
  myAnimationFile: boolean;
  myImageFile: boolean;
  animationLibraryFile: boolean;
  imageLibraryFile: boolean;
  myFile: boolean;
  rootFile: boolean;
  libraryFile: boolean;
  display = false;
  repeat = 'None';
  currentYear = Number(new Date().getFullYear());
  // maxYearDate: Date;
  // dobYearRange = '';
  myfile: any;
  // fileToUpload: File[] = [];
  fileToUpload: any[] = [];
  filesToUpload: any = [];
  // fileToUpload: FileList;
  // fileToUpload: File;
  imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
  isPreviewImage: boolean;
  isPreviewVideo: boolean;
  isPreviewObject: boolean;
  videoType: string;
  model: any = {};
  // selectedFiles: FileList;
  // uploadedFiles: any[] = [];
  CONFIG = this.config;
  user_name: string;
  user_role: string;
  uploads = [];
  date = new Date();
  fileExplorer: any;
  fileNamesList: any = [];
  constructor(private notifier: NotifierService, private route: ActivatedRoute,
    private config: Config, private service: SchedulesService,
    private sanitizer: DomSanitizer, private router: Router, private spinner: NgxSpinnerService) { }
  // public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'myfile'});


  ngOnInit() {
    this.model.priority = 1;
    this.model.scheduleName = 'NewSchedule';

    this.model.startDate = this.date.toISOString().slice(0, 10);
    this.model.startTime = this.date.toTimeString().slice(0, 5);
    this.model.firstYear = this.date.getFullYear();
    this.model.lastYear = Number(this.date.getFullYear() + 1);
    const currentYear = this.date.getFullYear();
    this.date.setFullYear(currentYear + 1, 11, 29);
    this.model.endDate = this.date.toISOString().slice(0, 10);
    this.model.endTime = '23:59';
    this.model.monthorweek = 'week';
    this.model.moduloYDay = '1';
    this.model.moduloWeek = '1';
    this.model.duration = '00:00:06';
    this.model.scheduleMonthDays = '1';
    // this.model.ondate = new Date();
    this.model.myfiles = [];

    this.route.queryParams
      .filter(params => params.repeat)
      .subscribe(params => {
        // console.log(params);
        // // console.log(params.repeat);
        this.repeat = params.repeat;
      });
    // this.videoJSplayer = videojs('video_player');
    // this.getImageFromServer('http://192.168.1.243:2220/leddesigner/schedule/getImageLibrary/1.bmp');
  }
  // jwPlayer() {
  //   const playerJw = jwplayer('player').setup({
  //     title: 'Player Test',
  //     playlist: 'https://cdn.jwplayer.com/v2/media/8L4m9FJB',
  //     width: 640,
  //     height: 360,
  //     aspectratio: '16:9',
  //     mute: true,
  //     autostart: true,
  //     primary: 'html5',
  //   });
  // }
  initVideoJs() {
    // this.videoJSplayer = videojs('video_player');
    // // const transcript = this.videoJSplayer.transcript();
    // // const transcriptCon = document.querySelector('#transcriptContainer');
    // // transcriptCon.appendChild(transcript.el());
  }
  ngAfterViewInit(): void {
    this.initVideoJs();
  }
  ngOnDestroy(): void {
    // this.videoJSplayer.dispose();
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

  pickFile(file, filename) {
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
        this.handleFileInput(Image);
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

  blobToFile = (theBlob, fileName: string): File => {
    const b: any = theBlob;
    // const list: any = [];
    b.lastModifiedDate = new Date();
    b.name = fileName;
    // list.push(<File>theBlob);
    // return list;
    // console.log(<File>theBlob);
    return <File>theBlob;
    // const file = new File(theBlob, fileName, { type: 'image/jpeg', lastModified: Date.now() });
    // return file;
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return blob;
  }

  handleFileInput(file) {
    // let isMatched = false;
    // console.log('this.fileNamesList.indexOf(file.name) => ', this.fileNamesList.indexOf(file.name));
    if (this.fileNamesList.indexOf(file.name) >= 0) {
      this.notifier.notify('warning', 'Same File Name Exist.');
      // isMatched = true;
    } else {
      file.duration = '00:00:06';
      this.fileToUpload.push(file);
      this.fileNamesList.push(file.name);
      // console.log('file => ', file);
      // this.filesToUpload.duration.push('00:00:06');
      // this.filesToUpload.files.push(file);
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

  showImagePreview(file: File) {
    // Show image preview
    this.spinner.show();
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
      if ((this.imageUrl.toString().substr(this.imageUrl.toString().indexOf('data'), 10) === 'data:video')) {
        this.isPreviewImage = false;
        this.isPreviewObject = false;
        this.isPreviewVideo = true;
        this.videoType = file.type;
        // console.log('video file selected');
      } else if ((this.imageUrl.toString().substr(this.imageUrl.toString().indexOf('data'), 10) === 'data:image')) {
        this.isPreviewVideo = false;
        this.isPreviewObject = false;
        this.isPreviewImage = true;
      } else {
        // const blob = this.b64toBlob((event.target.result)
        //   .replace('data:application/x-shockwave-flash;base64,', ''), 'application/x-shockwave-flash');
        // const blobUrl = URL.createObjectURL(blob);
        // this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        this.isPreviewVideo = false;
        this.isPreviewImage = false;
        this.isPreviewObject = true;
        // console.log('Animation File Found');
      }
      this.spinner.hide();
    };
    reader.readAsDataURL(file);
    // console.log(this.imageUrl.toString());

  }

  deleteImage(index) {
    this.fileToUpload.splice(index, 1);
    this.fileNamesList.splice(index, 1);
    // this.filesToUpload.splice(index, 1);
    this.isPreviewImage = false;
    this.myfile = '';
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
    // const dura = new Map<string, string>();
    // let dura = '{';
    this.durationList = [];
    this.fileToUpload.forEach(file => {
      // console.log('file.duration => ', file.duration);
      // dura.push({
      //   ['"' + file.name + '"']: this.timeToMS(file.duration)
      // });
      // dura += '"' + file.name + '":' + '"' + this.timeToMS(file.duration) + '"';

      const dura: any = {};
      dura.name = file.name;
      dura.regex = this.timeToMS(file.duration);
      this.durationList.push(dura);
      // dura.set(file.name, this.timeToMS(file.duration).toString());
    });
    // dura += '}';
    this.model.durationList = this.durationList;
    // console.log('fileToUpload => ', this.fileToUpload);
    // console.log('model => ', this.model);
    this.service.createSchedule(this.model, this.fileToUpload, this.repeat).subscribe(res => {
      console.log('res => ', res);
      this.spinner.hide();
    }, error => {
      if (error.status === 201) {
        this.notifier.notify('success', 'Scheduled Stored Successfully');
        this.model = {};
        this.fileToUpload = [];
        this.spinner.hide();
        this.router.navigate(['/user/schedules']);
      } else if (error.status === 500) {
        // this.notifier.notify('error', error.message);
        this.notifier.notify('error', error.error.message);
      } else if (error.status === 400) {
        this.notifier.notify('warning', 'Select File To upload');
      } else {
        this.notifier.notify('error', error.error);
      }
      console.log(error);
      this.spinner.hide();
    });

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
