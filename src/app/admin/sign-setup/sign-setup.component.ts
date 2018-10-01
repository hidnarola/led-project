import { Component, OnInit, AfterViewChecked } from '@angular/core';
// import $ from 'jquery';

import { SignsService } from '../../shared/signs.service';
@Component({
  selector: 'app-sign-setup',
  templateUrl: './sign-setup.component.html',
  styleUrls: ['./sign-setup.component.css']
})
export class SignSetupComponent implements OnInit, AfterViewChecked {
  data: any;
  dtOptions: DataTables.Settings = {};
  constructor(private service: SignsService) { }

  ngOnInit() {

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   serverSide: true,
    //   // processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     this.service.getAllSigns().subscribe(res => {
    //       this.data = res;
    //       // console.log(res);

    //       // callback({
    //       //   recordsTotal: res.length,
    //       //   recordsFiltered: res.recordsFiltered,
    //       //   data: []
    //       // });
    //     });

    //   },

    //   columns: [{ data: 'name' }, { data: 'type' }, { data: 'host' }, { data: 'port' }, { data: 'timezone' }, , { data: 'width' }]
    // };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.getSigns();
  }

  getSigns() {
    this.service.getAllSigns().subscribe(res => {
      this.data = res;
      // console.log(res);
    });
  }

  deleteSign(id) {
    // console.log(id);
    this.service.deleteSign(id).subscribe(res => {
      console.log(res);
    });
  }
  ngAfterViewChecked(): void {
    // this.loadDatatable();
    // $('.datatable-basic').DataTable();
  }

  // loadDatatable() {
  //   $.extend($.fn.dataTable.defaults, {
  //     autoWidth: false,
  //     columnDefs: [{
  //       orderable: false,
  //       width: '100px',
  //       targets: [5]
  //     }],
  //     dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
  //     language: {
  //       search: '<span>Filter:</span> _INPUT_',
  //       lengthMenu: '<span>Show:</span> _MENU_',
  //       paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
  //     },
  //     drawCallback: function () {
  //       $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
  //     },
  //     preDrawCallback: function () {
  //       $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
  //     }
  //   });


  //   // Basic datatable
  //   $('.datatable-basic').DataTable();


  //   // Alternative pagination
  //   $('.datatable-pagination').DataTable({
  //     pagingType: 'simple',
  //     language: {
  //       paginate: { 'next': 'Next &rarr;', 'previous': '&larr; Prev' }
  //     }
  //   });
  // }

}
