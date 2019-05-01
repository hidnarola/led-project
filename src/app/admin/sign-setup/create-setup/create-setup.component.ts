import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { SignsService } from '../../../shared/signs.service';
import { Config } from '../../../shared/config';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-create-setup',
  templateUrl: './create-setup.component.html',
  styleUrls: ['./create-setup.component.css']
})
export class CreateSetupComponent implements OnInit, AfterViewChecked {
  signType: any;
  model: any = {};
  timezones: any;
  user_name: string;
  user_role: string;
  constructor(private notifier: NotifierService, private service: SignsService, private config: Config,
    private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.signType = this.config.signType;
    this.timezones = this.config.timeZone;
    this.model.signtype = this.signType[0];
    this.model.timezone = 'America/Los_Angeles : (GMT-08:00) Pacific Time';
  }
  onSubmit() {
    this.spinner.show();
    this.service.addSign(this.model).subscribe(res => {
      this.notifier.notify('success', 'Added Successfully');
      // this.model = {};
      // this.model.signtype = this.signType[0];
      // this.model.timezone = 'America/Los_Angeles : (GMT-08:00) Pacific Time';
      this.spinner.hide();
      this.router.navigate(['/admin/sign-setup']);
    }, error => {
      this.spinner.hide();
    }
    );
  }

  ngAfterViewChecked(): void {
    this.select2setup();
  }
  select2setup() {
    // // Default initialization
    // $('.select').select2({
    //   minimumResultsForSearch: Infinity
    // });


    // // Select with search
    //  $('.select-search').select2();


    // // Fixed width. Single select
    // $('.select-fixed-single').select2({
    //   minimumResultsForSearch: Infinity,
    //   width: 250
    // });


    // // Fixed width. Multiple selects
    // $('.select-fixed-multiple').select2({
    //   minimumResultsForSearch: Infinity,
    //   width: 400
    // });



    // // Styling options
    // // ------------------------------

    // // Custom results color
    // $('.select-results-color').select2({
    //   containerCssClass: 'bg-teal-400'
    // });


    // // Custom menu color
    // $('.select-menu-color').select2({
    //   dropdownCssClass: 'bg-teal-400'
    // });


    // // Custom menu and results color
    // $('.select-custom-colors').select2({
    //   containerCssClass: 'bg-indigo-400',
    //   dropdownCssClass: 'bg-indigo-400'
    // });


    // // Combine custom colors in multiple
    // $('.select-menu2-color').select2({
    //   containerCssClass: 'bg-indigo-400',
    //   dropdownCssClass: 'bg-indigo-400'
    // });

    // // Menu border and text color
    // $('.select-border-color').select2({
    //   dropdownCssClass: 'border-primary',
    //   containerCssClass: 'border-primary text-primary-700'
    // });
  }

}
