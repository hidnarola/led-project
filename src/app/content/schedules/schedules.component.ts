import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  persons: any = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  // dtTrigger: Subject<any> = new Subject();
  constructor() { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.persons = [
      { firstname: 'Ketan', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' },
      { firstname: 'Karan', lastname: 'Patel' },
      { firstname: 'Krishna', lastname: 'Patel' }
    ];
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }

  // private extractData(res: Response) {
  //   const body = res.json();
  //   return body.data || {};
  // }
}
