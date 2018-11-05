import { Component, OnInit } from '@angular/core';
import { Config } from '../../../shared/config';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SchedulesService } from '../../../shared/schedules.service';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
// import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


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
    // this.model.ondate = new Date();
    this.model.myfiles = [];

    this.route.queryParams
      .filter(params => params.repeat)
      .subscribe(params => {
        // console.log(params);
        // // console.log(params.repeat);
        this.repeat = params.repeat;
      });
  }

  handleFileInput(event) {
    // this.onChangeInput(event);
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
    // console.log(this.imageUrl);

  }

  deleteImage(index) {
    this.fileToUpload.splice(index, 1);
    this.isPreviewImage = false;
    this.myfile = '';
  }

  onSubmit() {

    // // console.log(this.model);
    this.spinner.show();
    // if (this.repeat === this.config.SCHE_CONT) {
    this.service.createSchedule(this.model, this.fileToUpload, this.repeat).subscribe(res => {
    }, error => {
      if (error.status === 201) {
        this.notifier.notify('success', 'Scheduled Stored Successfully');
        this.model = {};
        this.fileToUpload = [];
        this.spinner.hide();
        this.router.navigate(['/user/schedules']);
      } else if (error.status === 500) {
        // this.notifier.notify('error', error.message);
        this.notifier.notify('error', 'Invalid File selected');
      } else if (error.status === 400) {
        this.notifier.notify('warning', 'Select File To upload');
      } else {
        this.notifier.notify('error', error.error);
      }
      console.log(error);
      this.spinner.hide();
    });

  }


}
