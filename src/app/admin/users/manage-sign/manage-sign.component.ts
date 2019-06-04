import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignsService } from '../../../shared/signs.service';
import { UserSignService } from '../../../shared/user-sign.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-manage-sign',
    templateUrl: './manage-sign.component.html',
    styleUrls: ['./manage-sign.component.css']
})
export class ManageSignComponent implements OnInit {
    userid: any;
    signForm: FormGroup;
    // signs: FormArray;
    allSign: any = [];
    fieldArray: any = [];
    addNewSign: any;
    // firstField = true;
    isAddNew: boolean;
    oldChoice: Number = 0;
    newChoice: Number;

    constructor(
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private service: SignsService,
        private usservice: UserSignService,
        private notifier: NotifierService,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.signForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
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

    getAllSigns() {
        this.spinner.show();
        this.service.getAllSigns().toPromise().then(res => {
            this.allSign = res;
            this.spinner.hide();
        }).catch(error => {
            this.spinner.hide();
        });
    }
    getSignByUser() {
        this.spinner.show();
        this.usservice.getSignByUserId_admin(this.userid).toPromise().then(res => {
            this.fieldArray = res;
            this.spinner.hide();
        }).catch(error => {
            this.spinner.hide();
        });

    }

    onchangeSign(id) {
        this.newChoice = id;
        if (this.oldChoice !== 0 || this.oldChoice) {
            this.usservice.deleteUserSign(this.oldChoice).toPromise();
        }
        this.usservice.addUserSign(this.newChoice, this.userid)
            .toPromise().then(res => {
                this.notifier.notify('success', 'Updated Successfully');
            }).catch(error => {
                if (error.status === 500) {
                    this.notifier.notify('error', 'Already Exist.');
                }
            });
    }

    addUserSign() {
        this.spinner.show();
        this.usservice.addUserSign(this.addNewSign, this.userid).toPromise().then(res => {
                this.notifier.notify('success', 'Added Successfully');
                this.spinner.hide();
                this.getSignByUser();
            }).catch(error => {
                if (error.status === 500) {
                    this.notifier.notify('error', error.error.message);
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            });
    }

    addFieldValue() {
        this.isAddNew = !this.isAddNew;
    }

    deleteFieldValue(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.spinner.show();
                this.usservice.deleteUserSign(id).toPromise().then(res => {
                    this.notifier.notify('success', res['message']);
                    this.spinner.hide();
                    this.getSignByUser();
                }).catch( error => {
                    this.spinner.hide();
                }
                );
            },
            reject: () => {
                this.notifier.notify('info', 'Request Rejected For Delete');
            }
        });

    }
}
