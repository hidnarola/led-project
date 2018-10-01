import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-manage-sign',
  templateUrl: './manage-sign.component.html',
  styleUrls: ['./manage-sign.component.css']
})
export class ManageSignComponent implements OnInit {
  userid: any;
  constructor(private route: ActivatedRoute) { }
  timezone: any = [
    { 'name': 'MacDonalds-Irvine 1', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 2', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 3', 'type': 'GRAYSCALE', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 4', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 5', 'type': 'GRAYSCALE', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 6', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 7', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 8', 'type': 'GRAYSCALE', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' }
  ];
  fieldArray: Array<any> = [
    { 'name': 'MacDonalds-Irvine 1', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 3', 'type': 'GRAYSCALE', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 7', 'type': 'RGB', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' },
    { 'name': 'MacDonalds-Irvine 8', 'type': 'GRAYSCALE', 'ip': '192.168.1.21', 'port': '22', 'timezone': 'America/Los_Angelos(Pacific)' }
  ];
  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'MacDonalds-Irvine';
  isEditItems: boolean;

  ngOnInit() {
     this.route.params.subscribe(params => {
      this.userid = params['id'];
    });
  }

  addFieldValue(index) {
    // if (this.fieldArray.length <= 2) {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
    // } else {

    // }
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  onEditCloseItems() {
    this.isEditItems = !this.isEditItems;
  }

}
