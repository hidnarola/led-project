import { Component, OnInit } from '@angular/core';
import { Config } from '../../../shared/config';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SchedulesService } from '../../../shared/schedules.service';
import { forEach } from '@angular/router/src/utils/collection';
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
  years = [];
  // maxYearDate: Date;
  // dobYearRange = '';
  myfile: any;
  fileToUpload: File[] = [];
  imageUrl = '/assets/images/signature.png';
  isPreview: boolean;
  model: any = {};
  // selectedFiles: FileList;
  // uploadedFiles: any[] = [];
  CONFIG = this.config;
  user_name: string;
  user_role: string;
  constructor(private notifier: NotifierService, private route: ActivatedRoute,
    private config: Config, private service: SchedulesService) { }
  // public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'myfile'});

  ngOnInit() {

    // this.maxYearDate = new Date(new Date().setFullYear(new Date().getFullYear()));
    // this.dobYearRange = '1900:' + (new Date().getFullYear() - 12);

    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.model.monthorweek = 'week';
    // this.model.ondate = new Date();
    this.model.myfiles = [];
    for (let i: any = new Date().getFullYear(); this.years.length < 100; i++) {
      // console.log(this.years.length + ' : ' + i);
      this.years.push({ 'value': i });
    }
    // console.log(this.years);
    this.route.queryParams
      .filter(params => params.repeat)
      .subscribe(params => {
        console.log(params);
        // console.log(params.repeat);
        this.repeat = params.repeat;
      });
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
      this.service.continuousCreate(this.model, this.fileToUpload).subscribe(res => {
        console.log(res);
      });
    } else {
      console.log(this.repeat);
      console.log(this.model);
    }
  }
  // myUploader(event) {
  //   console.log('myUploader: ' + JSON.stringify(event.files));
  //   this.model.myfiles = event.files;
  // }

  // onselectedFiles(event) {
  //   console.log('onselectedFiles: ' + JSON.stringify(event.files));
  //   this.selectedFiles = event.files;
  //   // this.model.myfiles.push(this.selectedFiles);
  //   // console.log('onselectedFiles: ' + this.selectedFiles);
  // }

  // onUpload(event): void {
  //   console.log('onUpload');
  //   for (const file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  //   console.log('onUpload' + this.uploadedFiles);
  // }

  // selectFiles(event) {
  //   this.selectedFiles = event.target.files;
  //   this.model.myfiles = this.selectedFiles;
  //   console.log(event.target.files);
  // }

  // // Converting into array of DataURL
  // // ================================
  // onSelectFile(data) {
  //   console.log(data.target.files);
  //   event = data;
  //   if (event.target.files && event.target.files[0]) {
  //     const filesAmount = event.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {
  //       const reader = new FileReader();

  //       reader.onload = (event) => {
  //         console.log(event.target.result);
  //         this.myfiles.push(event.target.result);
  //         // this.model.myfiles.push(event.target.files[i]);
  //       };

  //       reader.readAsDataURL(event.target.files[i]);
  //     }
  //   }
  // }

}
