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
  SCHE = this.config;
  constructor(private route: ActivatedRoute, private config: Config, private service: SchedulesService) { }
  // public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'myfile'});

  ngOnInit() {
    this.model.myfiles = [];
    this.route.queryParams
      .filter(params => params.repeat)
      .subscribe(params => {
        console.log(params);
        // console.log(params.repeat);
        this.repeat = params.repeat;
      });

    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    //      console.log('ImageUpload:uploaded:', item, status, response);
    //      alert('File uploaded successfully');
    //  };
  }

  onSubmit() {
    console.log(this.model);
    this.service.continuousCreate(this.model).subscribe(res => {
      console.log(res);
    });
  }

  selectFiles(event) {
    this.selectedFiles = event.target.files;
    this.model.myfiles =  this.selectedFiles;
    console.log(event.target.files);
  }

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
