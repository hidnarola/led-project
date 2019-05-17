import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSignService } from '../../shared/user-sign.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignsService } from 'src/app/shared/signs.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-my-signs',
  templateUrl: './my-signs.component.html',
  styleUrls: ['./my-signs.component.css']
})
export class MySignsComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  userid: string;
  signArray: any = [];
  user_name: string;
  user_role: string;
  constructor(private service: UserSignService,
    private notifier: NotifierService,
    private signService: SignsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.userid = localStorage.getItem('userid');
    this.dtOptions = {
      pagingType: 'full_numbers',
      destroy: true,
      pageLength: 5,
      order: [0, 'asc']
    };
    this.getSignByUser();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  downloadSign(signId) {
    this.spinner.show();
    this.signService.downloadSign(signId).toPromise().then(result => {
      if (result) {
        const headers = result.headers.get('content-disposition');
        console.log("hreader..", headers);

        const filename = headers.split('=')[1];
        this.signService.downloadFile(result.body, filename);
        this.spinner.hide();
      }
    }).catch(error => {
      this.notifier.notify('error', 'Diagnostic file not found!');
      this.spinner.hide();
    });
  }


  getSignByUser() {
    this.spinner.show();
    this.service.getSignByUserId_user(this.userid).subscribe(res => {
      this.signArray = res;
      this.dtTrigger.next();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
}
