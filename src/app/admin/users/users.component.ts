import { Component, OnInit, AfterViewChecked } from '@angular/core';
// import $ from 'jquery';
import { UsersService } from '../../shared/users.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewChecked {

  dtOptions: DataTables.Settings = {};
  data: any;
  user_name: string;
  user_role: string;
  constructor(private service: UsersService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getUsers();

  }

  ngAfterViewChecked(): void {
    // this.loadDatatable();
    // $('.datatable-basic').DataTable();
  }

  loadDatatable() {
    // $.extend($.fn.dataTable.defaults, {
    //   autoWidth: false,
    //   columnDefs: [{
    //     orderable: false,
    //     width: '100px',
    //     targets: [5]
    //   }],
    //   dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
    //   language: {
    //     search: '<span>Filter:</span> _INPUT_',
    //     lengthMenu: '<span>Show:</span> _MENU_',
    //     paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
    //   },
    //   drawCallback: function () {
    //     $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
    //   },
    //   preDrawCallback: function () {
    //     $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
    //   }
    // });


    // // Basic datatable
    // $('.datatable-basic').DataTable();


    // // Alternative pagination
    // $('.datatable-pagination').DataTable({
    //   pagingType: 'simple',
    //   language: {
    //     paginate: { 'next': 'Next &rarr;', 'previous': '&larr; Prev' }
    //   }
    // });
  }

  getUsers() {
    this.service.getAllUsers().subscribe(res => {
      this.data = res;
      console.log(res);
    });
  }

  deleteUser(id) {
    // this.service.deleteProfile(id).subscribe(res => {
    //   alert('Not Allowed');
    // });

    alert('Not Allowed');
  }

}
