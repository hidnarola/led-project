import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignsService } from '../../../shared/signs.service';
import { UserSignService } from '../../../shared/user-sign.service';
import { NotifierService } from 'angular-notifier';

// import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-sign',
  templateUrl: './manage-sign.component.html',
  styleUrls: ['./manage-sign.component.css']
})
export class ManageSignComponent implements OnInit, OnDestroy {
  userid: any;
  user_name: string;
  user_role: string;
  signForm: FormGroup;
  signs: FormArray;
  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute, private service: SignsService,
    private usservice: UserSignService, private notifier: NotifierService,
    private confirmationService: ConfirmationService, private spinner: NgxSpinnerService) { }
  allSign: any = [];
  fieldArray: any = [];
  newAttribute: any = {};
  addNewSign: any;
  firstField = true;
  firstFieldName = 'MacDonalds-Irvine';
  isEditItems: boolean;
  isAddNew: boolean;
  oldChoice: Number = 0;
  newChoice: Number;
  // dtTrigger = new Subject();
  // dtOptions: DataTables.Settings = {};
  ngOnInit() {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   order: [0, 'desc']
    // };
    this.signForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]) // here
    });
    this.route.params.subscribe(params => {
      this.userid = params['id'];
      this.getSignByUser();
    });
    this.getAllSigns();
  }

  initItemRows() {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      itemname: ['']
    });
  }

  // addNewRow() {
  //   // control refers to your formarray
  //   const control = <FormArray>this.signForm.controls['itemRows'];
  //   // add new formgroup
  //   control.push(this.initItemRows());
  // }

  // deleteRow(index: number) {
  //   // control refers to your formarray
  //   const control = <FormArray>this.signForm.controls['itemRows'];
  //   // remove the chosen row
  //   control.removeAt(index);
  // }


  getAllSigns() {
    this.spinner.show();
    this.service.getAllSigns().subscribe(res => {
      this.allSign = res;
      // console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  getSignByUser() {
    this.spinner.show();
    this.usservice.getSignByUserId_admin(this.userid).subscribe(res => {
      this.fieldArray = res;
      // this.dtTrigger.next();
      // console.log('fieldArray', res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });

  }

  // onfocusSign(id) {
  //   // this.notifier.notify('info', event.target.value);
  //   // console.log('old : ' + id);
  //   this.oldChoice = id;
  // }

  onchangeSign(id) {
    // this.notifier.notify('info', event.target.value);
    // console.log('old : ' + this.oldChoice);
    // console.log('new : ' + id);

    this.newChoice = id;
    if (this.oldChoice !== 0 || this.oldChoice) {
      this.usservice.deleteUserSign(this.oldChoice)
        .subscribe(res => {
          // this.notifier.notify('info', '');
        }, error => {
          // this.notifier.notify('error', error.message);
          // console.log(error.message);
        });

      // this.deleteFieldValue(this.oldChoice);
    }
    this.usservice.addUserSign(this.newChoice, this.userid)
      .subscribe(res => {
        this.notifier.notify('success', 'Updated Successfully');
        // this.onEditCloseItems();
      }, error => {
        if (error.status === 500) {
          this.notifier.notify('error', 'Already Exist.');
        } else {
          // console.log(error);
        }
      });
    // this.oldChoice = id;

  }

  addUserSign() {
    // console.log(this.addNewSign + ' - ' + this.userid);
    this.spinner.show();
    this.usservice.addUserSign(this.addNewSign, this.userid)
      .subscribe(res => {
        this.notifier.notify('success', 'Added Successfully');
        this.spinner.hide();
        this.getSignByUser();
        // this.onEditCloseItems();
      }, error => {
        if (error.status === 500) {
          this.notifier.notify('error', error.error.message);
          this.spinner.hide();
        } else {
          console.log(error);
          this.spinner.hide();
        }
      });
    // this.addFieldValue();
  }

  addFieldValue() {
    // this.fieldArray.push(this.newAttribute);
    // this.newAttribute = {};
    this.isAddNew = !this.isAddNew;
  }

  deleteFieldValue(id) {

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.spinner.show();
        this.usservice.deleteUserSign(id).subscribe(res => {
          // this.fieldArray.splice(index, 1);
          this.notifier.notify('warning', res.toString());
          this.spinner.hide();
          this.getSignByUser();
        }, error => {
          // this.notifier.notify('error', 'Something Wrong');
          // this.getSignByUser();
          if (error.status === 200) {
            this.notifier.notify('warning', error.error.text);
            this.getSignByUser();
          } else {
            console.log(error);
          }
          this.spinner.hide();
        }
        );
      },
      reject: () => {
        this.notifier.notify('info', 'Request Rejected For Delete');
      }
    });

  }

  // onEditCloseItems() {
  //   this.isEditItems = !this.isEditItems;
  //   this.getSignByUser();
  // }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }

  // // *** DYNAMIC GENERATES CONTROLS ** //

  // initItemRows() {
  //   return this._fb.group(
  //     {
  //       itemname: ['']
  //     }
  //     // {
  //     //   name: '',
  //     //   description: '',
  //     //   price: ''
  //     // }
  //   );
  // }

  // addNewRow() {
  //   // control refers to your formarray
  //   const control = <FormArray>this.manageSign.controls['itemRows'];
  //   // add new formgroup
  //   control.push(this.initItemRows());


  //   // this.items = this.orderForm.get('items') as FormArray;
  //   // this.items.push(this.createItem());

  // }

  // deleteRow(index: number) {
  //   // control refers to your formarray
  //   const control = <FormArray>this.manageSign.controls['itemRows'];
  //   // remove the chosen row
  //   control.removeAt(index);
  // }

  // createItem(): FormGroup {
  //   return this.formBuilder.group({
  //     name: '',
  //     description: '',
  //     price: ''
  //   });
  // }

  // addItem(): void {
  //   this.items = this.orderForm.get('items') as FormArray;
  //   this.items.push(this.createItem());
  // }


}
