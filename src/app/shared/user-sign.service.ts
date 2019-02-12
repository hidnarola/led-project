import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

import { Config } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class UserSignService {
  apiURL = this.config.apiURL;
  constructor(private http: HttpClient, private config: Config) { }

// Use For User Side
  getSignByUserId_user(id) {
    const uri = this.apiURL + 'leddesigner/signmapping/getUserSigns?userid=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  // Use For Admin Side
  getSignByUserId_admin(id) {
    const uri = this.apiURL + 'leddesigner/signmapping/getUserSignMapping?userid=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  addUserSign(sid, uid) {
    const uri = this.apiURL + 'leddesigner/signmapping/addUserSigns';
    const us = {
      signid: Number(sid),
      userid: Number(uid)
    };
    return this.http
      .post(uri, us)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  deleteUserSign(id) {
    const uri = this.apiURL + 'leddesigner/signmapping/deleteMapping?id=' + id;

    return this.http
      .delete(uri)
      .pipe(map(res => {
        return res;
      }
      ));
  }

  getSignBySignId(id) {
    const uri = this.apiURL + 'leddesigner/signmapping/getSignUsers?signid=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }


}
