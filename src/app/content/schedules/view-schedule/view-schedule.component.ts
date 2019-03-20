import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
  user_name: string;
  user_role: string;
  files = [];
  // File Type
  uploads = [];
  fileSelector = document.getElementById('file-selector');
  isPreviewImage: boolean;
  isPreviewVideo: boolean;
  isPreviewObject: boolean;
  videoType: string;
  res: any;
  dto: any;
  repeat: string;
  CONFIG = this.config;
  imageUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/images/signature.png');
  constructor(private route: ActivatedRoute, private service: SchedulesService,
    private config: Config, private sanitizer: DomSanitizer,
    private notifier: NotifierService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.spinner.show();
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.service.getScheduleById(params['id']).subscribe(res => {
        this.res = res;
        this.repeat = this.res.type;
        this.dto = this.res.schduleDTO;
        this.files = this.res.multipartImages;
        let HH = ('0' + this.dto.startTime.hour).slice(-2);
        let MM = ('0' + this.dto.startTime.minute).slice(-2);
        this.dto.startTime = HH + ':' + MM + ':00';
        HH = ('0' + this.dto.endTime.hour).slice(-2);
        MM = ('0' + this.dto.endTime.minute).slice(-2);
        this.dto.endTime = HH + ':' + MM + ':00';
        if (this.CONFIG.SCHE_MONT === this.repeat) {
          // this.dto.scheduleMonthDays = this.service.getValueOfScheduleMonthDays(this.dto.scheduleMonthDays).toString();
        }
        // console.log(res);
        this.spinner.hide();
      }, error => {
        this.notifier.notify('error', error.error.message);
        console.log(error.error.message);
        this.spinner.hide();
        this.router.navigate(['/user/schedules']);
      });
    });
  }

  imagePreview(filename) {
    // this.isPreview = true;
    this.isPreviewImage = false;
    this.isPreviewObject = false;
    this.isPreviewVideo = false;
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
      this.spinner.hide();
      console.log(error);
      // const baseData = window.btoa(unescape(encodeURIComponent(error.error.text)));
      // console.log(error);
      // this.imageUrl =
      //   this.domSanitizer.bypassSecurityTrustUrl(
      //   'data:image/png;base64,' + baseData
      //   )
      //   ;

      // this.showImagePreview(error.error.text);

      // this.imageUrl = btoa(error.error.text);
    });
    // this.service.getImageForPreview(filename, localStorage.getItem('userid')).subscribe(res => {
    //   console.log('res => ', res);
    // }, error => {
    //   console.log('error => ', error);
    // });
  }

  // byteArrayToBase64(binary) {
  //   let base64String = '';
  //   // const bytes = new Uint8Array(binary);
  //   const bytes = binary;
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     base64String += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(unescape(encodeURIComponent(base64String)));
  // }

  // binaryToFile(bytes) {
  //   // const u8 = new Uint8Array(bytes.bytelength);
  //   // // Copy over all the values
  //   // for (let i = 0; i < bytes.bytelength; i++) {
  //   //   u8[i] = bytes[i].charCodeAt(0);
  //   // }
  //   console.log(bytes);
  //   // Now we write the typed array to the Blob instead of the string
  //   const blob = new Blob([bytes], { type: 'image/png' });
  //   // // console.log(blob);
  //   // saveAs(blob, 'myImage.png');
  //   this.showImagePreview(blob);
  // }

  // ***************************************
  // getFiles(event) {
  //   this.files = event.target.files;
  //   const reader = new FileReader();
  //   reader.onload = this._handleReaderLoaded.bind(this);
  //   reader.readAsBinaryString(this.files[0]);
  // }

  // _handleReaderLoaded(readerEvt) {
  //   const binaryString = readerEvt.target.result;
  //   this.imageUrl = btoa(binaryString);  // Converting binary string data.
  // }

  // **************************************
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


  // onChangeInput(files: FileList) {
  //   const that = this;
  //   // console.time('FileOpen');
  //   const file = files.item(0);
  //   const filereader = new FileReader();
  //   filereader.onloadend = function (evt: any) {
  //     // if (evt.target.readyState === FileReader.DONE) {
  //     const uint = new Uint8Array(evt.target.result);
  //     console.log(evt.target.result);
  //     const bytes = [];
  //     uint.forEach((byte) => {
  //       bytes.push(byte.toString(16));
  //     });
  //     const hex = bytes.join('').toUpperCase();
  //     that.uploads.push({
  //       filename: file.name,
  //       filetype: file.type ? file.type : 'Unknown/Extension missing',
  //       binaryFileType: that.getMimetype(hex),
  //       hex: hex
  //     });
  //     that.render();
  //     // }
  //     // console.timeEnd('FileOpen');
  //   };
  //   const blob = file.slice(0, 4);
  //   filereader.readAsArrayBuffer(blob);
  // }

  // render() {
  //   const container = document.getElementById('files');
  //   const uploadedFiles = this.uploads.map((file) => {
  //     return `<div>
  //               <strong>${file.filename}</strong><br>
  //               Filetype from file object: ${file.filetype}<br>
  //               Filetype from binary: ${file.binaryFileType}<br>
  //               Hex: <em>${file.hex}</em>
  //               </div>`;
  //   });
  //   container.innerHTML = uploadedFiles.join('');
  // }

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
