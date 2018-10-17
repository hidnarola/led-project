import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulesService } from '../../../shared/schedules.service';
import { Config } from '../../../shared/config';
import { DomSanitizer } from '@angular/platform-browser';
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


  res: any;
  dto: any;
  repeat: string;
  CONFIG = this.config;
  imageUrl: any;
  isPreview: boolean;
  constructor(private route: ActivatedRoute, private service: SchedulesService,
    private config: Config, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.route.params.subscribe(params => {
      console.log(params['id']);
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
        console.log(res);
      }, error => {
        console.log(error.error.message);
      });
    });
  }

  imagePreview(filename) {
    // this.isPreview = true;
    this.service.getImageForPreview(filename, localStorage.getItem('userid')).subscribe(res => {
      console.log(res);
      this.binaryToFile(res);
      // this.imageUrl = 'data:image/png;base64,' + res;
      // this.showImagePreview(res);
    }, error => {
      // const baseData = window.btoa(unescape(encodeURIComponent(error.error.text)));
      console.log(error);
      // this.imageUrl =
      //   this.domSanitizer.bypassSecurityTrustUrl(
      //   'data:image/png;base64,' + baseData
      //   )
      //   ;

      // this.showImagePreview(error.error.text);

      // this.imageUrl = btoa(error.error.text);
    });
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

  binaryToFile(bytes) {
    // const u8 = new Uint8Array(bytes.bytelength);
    // // Copy over all the values
    // for (let i = 0; i < bytes.bytelength; i++) {
    //   u8[i] = bytes[i].charCodeAt(0);
    // }

    // Now we write the typed array to the Blob instead of the string
    const blob = new Blob([bytes], { type: 'image/png' });
    // console.log(blob);
    // saveAs(blob, 'myImage.png');
    this.showImagePreview(blob);
  }

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

  showImagePreview(file) {
    this.isPreview = true;
    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      console.log(this.imageUrl);
    };
    reader.readAsDataURL(file);
    // reader.readAsBinaryString(file);
  }


  // onChangeInput(event) {
  //   const that = this;
  //   // console.time('FileOpen');
  //   const file = event.target.files[0];
  //   const filereader = new FileReader();
  //   filereader.onloadend = function (evt: any) {
  //     // if (evt.target.readyState === FileReader.DONE) {
  //     const uint = new Uint8Array(evt.target.result);
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

  // getMimetype = (signature) => {
  //   switch (signature) {
  //     case '89504E47':
  //       return 'image/png';
  //     case '47494638':
  //       return 'image/gif';
  //     case 'FFD8FFDB':
  //     case 'FFD8FFE0':
  //       return 'image/jpeg';
  //     case '3C3F786D':
  //       return 'image/svg+xml';
  //     case '00018':
  //       return 'video/mp4';
  //     case '504B0304':
  //     case '504B34':
  //       return 'application/zip';
  //     case '25504446':
  //       return 'application/pdf';
  //     default:
  //       return 'Unknown filetype';
  //   }
  // }
}
