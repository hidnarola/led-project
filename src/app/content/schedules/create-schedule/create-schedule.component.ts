import { Component, OnInit } from '@angular/core';
import { Config } from '../../../shared/config';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SchedulesService } from '../../../shared/schedules.service';

// import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

// const URL = 'http://localhost:3000/api/upload';
@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  repeat = 'None';
  model: any = {};
  selectedFiles: FileList;
  CONFIG = this.config;
  user_email: string;
  user_role: string;
  constructor(private route: ActivatedRoute, private config: Config, private service: SchedulesService) { }
  // public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'myfile'});

  ngOnInit() {
    this.user_email = localStorage.getItem('user_email');
    this.user_role = (localStorage.getItem('user_role')).replace('ROLE_', '');
    this.model.monthorweek = 'week';
    this.model.ondate = new Date();
    this.model.myfiles = [];
    this.route.queryParams
      .filter(params => params.repeat)
      .subscribe(params => {
        console.log(params);
        // console.log(params.repeat);
        this.repeat = params.repeat;
      });


  }

  // myUploader(event) {
  //   console.log(event.files);
  //   this.model.myfiles = event.files;
  // }

  onselectedFiles(event) {
    console.log(event.files);
    this.selectedFiles = event.files;
    this.model.myfiles = this.selectedFiles;
  }


  onSubmit() {

    if (this.repeat === this.config.SCHE_CONT) {
      this.service.continuousCreate(this.model).subscribe(res => {
        console.log(res);
      });
    } else {
      console.log(this.repeat);
      console.log(this.model);
    }
  }

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
