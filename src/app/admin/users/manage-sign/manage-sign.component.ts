import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignsService } from '../../../shared/signs.service';
import { UserSignService } from '../../../shared/user-sign.service';
import { NotifierService } from 'angular-notifier';

// import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-manage-sign',
  templateUrl: './manage-sign.component.html',
  styleUrls: ['./manage-sign.component.css']
})
export class ManageSignComponent implements OnInit {
  userid: any;
  user_name: string;
  user_role: string;
  // manageSign: FormGroup;
  // orderForm: FormGroup;
  // items: FormArray;
  constructor(
    // private formBuilder: FormBuilder, private _fb: FormBuilder,
    private route: ActivatedRoute, private service: SignsService,
    private usservice: UserSignService, private notifier: NotifierService) { }
  allSign: any = [];
  fieldArray: any = [];
  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'MacDonalds-Irvine';
  isEditItems: boolean;
  isAddNew: boolean;
  oldChoice: Number = 0;
  newChoice: Number;
  ngOnInit() {
    // this.user_name = localStorage.getItem('name');
    // this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');

    // this.manageSign = this._fb.group(
    //   {
    //     itemRows: this._fb.array([this.initItemRows()])
    //   }
    //   // {
    //   //   customerName: '',
    //   //   email: '',
    //   //   items: this._fb.array([this.initItemRows()])
    //   // }
    // );

    // this.orderForm = this.formBuilder.group({
    //   customerName: '',
    //   email: '',
    //   items: this.formBuilder.array([this.createItem()])
    // });

    this.route.params.subscribe(params => {
      this.userid = params['id'];
      this.getSignByUser();
    });

    this.service.getAllSigns().subscribe(res => {
      this.allSign = res;
      // // console.log(res);
    });

  }

  getSignByUser() {
    this.usservice.getSignByUserId_admin(this.userid).subscribe(res => {
      this.fieldArray = res;
      // console.log(res);
    });
  }

  onfocusSign(id) {
    // this.notifier.notify('info', event.target.value);
    // console.log('old : ' + id);
    this.oldChoice = id;
  }

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
        this.onEditCloseItems();
      }, error => {
        if (error.status === 500) {
          this.notifier.notify('error', 'Already Exist.');
        } else {
          // console.log(error);
        }
      });
    this.oldChoice = id;

  }

  addUserSign(id) {
    // console.log(id.toString().substr(3, 1));
    this.usservice.addUserSign(id.toString().substr(3, 1), this.userid)
      .subscribe(res => {
        this.notifier.notify('success', 'Added Successfully');
        this.onEditCloseItems();
      }, error => {
        if (error.status === 500) {
          this.notifier.notify('error', 'Already Exist.');
        } else {
          // console.log(error);
        }
      });
    this.addFieldValue();
  }

  addFieldValue() {
    // this.fieldArray.push(this.newAttribute);
    // this.newAttribute = {};
    this.isAddNew = !this.isAddNew;
  }

  deleteFieldValue(id) {
    this.usservice.deleteUserSign(id).subscribe(res => {
      // this.fieldArray.splice(index, 1);
      this.notifier.notify('warning', res.toString());
      this.getSignByUser();
    }, error => {
      // this.notifier.notify('error', 'Something Wrong');
      this.getSignByUser();
    }
    );
  }

  onEditCloseItems() {
    this.isEditItems = !this.isEditItems;
    this.getSignByUser();
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
