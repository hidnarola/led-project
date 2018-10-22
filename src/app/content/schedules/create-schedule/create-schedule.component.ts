import { Component, OnInit } from '@angular/core';
import { Config } from '../../../shared/config';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SchedulesService } from '../../../shared/schedules.service';
import { NotifierService } from 'angular-notifier';

// import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

// const URL = 'http://localhost:3000/api/upload';
@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  repeat = 'None';
  currentYear = Number(new Date().getFullYear());
  // maxYearDate: Date;
  // dobYearRange = '';
  myfile: any;
  fileToUpload: File[] = [];
  filesToUpload: FileList;
  // fileToUpload: FileList;
  // fileToUpload: File;
  imageUrl = '/assets/images/signature.png';
  isPreviewImage: boolean;
  isPreviewVideo: boolean;
  model: any = {};
  // selectedFiles: FileList;
  // uploadedFiles: any[] = [];
  CONFIG = this.config;
  user_name: string;
  user_role: string;
  uploads = [];
  constructor(private notifier: NotifierService, private route: ActivatedRoute,
    private config: Config, private service: SchedulesService) { }
  // public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'myfile'});

  ngOnInit() {

    // this.maxYearDate = new Date(new Date().setFullYear(new Date().getFullYear()));
    // this.dobYearRange = '1900:' + (new Date().getFullYear() - 12);

    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.model.monthorweek = 'week';
    // this.model.ondate = new Date();
    this.model.myfiles = [];
    // this.model.firstYear = this.currentYear;
    // this.model.lastYear = this.currentYear;

    // // Years [First and Last Year  Drop Down Loop]
    // for (let i: any = new Date().getFullYear(); this.years.length < 100; i++) {
    //   // // console.log(this.years.length + ' : ' + i);
    //   this.years.push({ 'value': i });
    // }
    // // console.log(this.years);
    this.route.queryParams
      .filter(params => params.repeat)
      .subscribe(params => {
        // console.log(params);
        // // console.log(params.repeat);
        this.repeat = params.repeat;
      });
  }

  handleFileInput(event) {
    this.onChangeInput(event);
    const file = event.target.files;
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
        this.filesToUpload = file;
      } else {
        this.notifier.notify('info', 'No File Selected');
      }
    }
    if (!isMatched) {
      if (file.length > 0) {
        this.fileToUpload.push(file.item(0));
        this.filesToUpload = file;
      } else {
        this.notifier.notify('info', 'No File Selected');
      }
      isMatched = false;
    }

    // console.log(this.fileToUpload);

    // console.log(this.filesToUpload);
  }

  showImagePreview(file: File, index) {
    if ((this.uploads[index].filetype) === 'video/mp4') {
      this.isPreviewVideo = true;
    } else {
      this.isPreviewImage = true;
    }
    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(file);
    console.log(this.imageUrl);
  }

  deleteImage(index) {
    this.fileToUpload.splice(index, 1);
    this.isPreviewImage = false;
    this.myfile = '';
  }

  onSubmit() {

    // // console.log(this.model);

    // if (this.repeat === this.config.SCHE_CONT) {
    this.service.createSchedule(this.model, this.fileToUpload, this.repeat).subscribe(res => {
    }, error => {
      if (error.status === 201) {
        this.notifier.notify('success', 'Scheduled Stored Successfully');
        this.model = {};
        this.fileToUpload = [];
      } else if (error.status === 500) {
        this.notifier.notify('error', error.error.message);
      } else if (error.status === 400) {
        this.notifier.notify('warning', 'Select File To upload');
      } else {
        this.notifier.notify('error', error.error);
      }
    });
    // } else {
    //   // console.log(this.repeat);
    //   // console.log(this.model);
    // }
  }
  onChangeInput(event) {
    const that = this;
    // console.time('FileOpen');
    const file = event.target.files[0];
    const filereader = new FileReader();
    filereader.onloadend = function (evt: any) {
      // if (evt.target.readyState === FileReader.DONE) {
      const uint = new Uint8Array(evt.target.result);
      const bytes = [];
      uint.forEach((byte) => {
        bytes.push(byte.toString(16));
      });
      const hex = bytes.join('').toUpperCase();
      that.uploads.push({
        filename: file.name,
        filetype: file.type ? file.type : 'Unknown/Extension missing',
        binaryFileType: that.getMimetype(hex),
        hex: hex
      });
      that.render();
      // }
      // console.timeEnd('FileOpen');
    };
    const blob = file.slice(0, 4);
    filereader.readAsArrayBuffer(blob);
  }

  render() {
    const container = document.getElementById('files');
    const uploadedFiles = this.uploads.map((file) => {
      return `<div>
                <strong>${file.filename}</strong><br>
                Filetype from file object: ${file.filetype}<br>
                Filetype from binary: ${file.binaryFileType}<br>
                Hex: <em>${file.hex}</em>
                </div>`;
    });
    // container.innerHTML = uploadedFiles.join('');
  }

  getMimetype = (signature) => {
    switch (signature) {
      case '89504E47':
        return 'image/png';
      case '47494638':
        return 'image/gif';
      case 'FFD8FFDB':
      case 'FFD8FFE0':
        return 'image/jpeg';
      case '3C3F786D':
        return 'image/svg+xml';
      case '00018':
        return 'video/mp4';
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
