import { Component, OnInit, OnDestroy } from '@angular/core';
// import $ from 'jquery';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { SignsService } from '../../shared/signs.service';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-sign-setup',
  templateUrl: './sign-setup.component.html',
  styleUrls: ['./sign-setup.component.css']
})
export class SignSetupComponent implements OnInit, OnDestroy {
  data: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  user_name: string;
  user_role: string;
  constructor(private service: SignsService, private notifier: NotifierService,
    private confirmationService: ConfirmationService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');

    this.dtOptions = {
      pagingType: 'full_numbers', destroy: true,
      pageLength: 10,
      order: [0, 'desc']
    };

    this.getSigns();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  getSigns() {
    this.spinner.show();
    this.service.getAllSigns().subscribe(res => {
      this.data = res;
      this.dtTrigger.next();
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 1000);
      // console.log(res);
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  deleteSign(id) {
    // // console.log(id);
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteSign(id).subscribe(res => {
          this.notifier.notify('success', 'Deleted Successfully');
          this.getSigns();
        }, error => {
          if (error.status === 200) {
            this.notifier.notify('error', error.error.text);
            this.getSigns();
          } else {
            console.log(error);
            this.spinner.hide();
          }
        });
      },
      reject: () => {
        this.notifier.notify('info', 'Request Rejected For Delete');
      }
    });
  }
}
