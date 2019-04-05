import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

import { Config } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private config: Config) { }

  getAllUsers() {
    const uri = '/leddesigner/user/getAllUsers';

    return this.http
      .get(uri)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }
      ));
  }

  getUserProfile(id) {
    const uri = '/leddesigner/user/getProfile?userid=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  deleteUser(id) {

    // Not implemented
    const uri = '/leddesigner/user/delete?id=' + id;

    return this.http
      .delete(uri)
      .pipe(map(res => {
        // // console.log(res);
        return res;
      }
      ));
  }

  changePassword(data) {
    const uri = '/leddesigner/user/changePassword';
    const profile = {
      userId: data.userId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };
    return this.http
      .put(uri, profile)
      .map(res => {
        return res;
      }
      );
  }

  updateProfile(data) {
    const uri = '/leddesigner/user/updateProfile';
    const profile = {
      // userid: data.userid,
      // email: data.email,
      // firstname: data.firstname,
      // lastname: data.lastname,
      // mobno: data.mobno,
      // companyname: data.companyname,
      // city: data.city,
      // state: data.state,
      // // lastModifiedDate: new Date().toLocaleString(),
      // // resetDate: new Date().toLocaleString(),
      // authorities: data.authorities

      authorities: data.authorities,
      firstname: data.firstname,
      lastname: data.lastname,
      mobno: data.mobno,
      companyname: data.companyname,
      city: data.city,
      state: data.state,
      userid: data.userid,
      password: data.password,
      email: data.email
    };
    // console.log(profile);
    return this.http
      .put(uri, profile)
      .map(res => {
        // console.log(res);
        return res;
      }
      );
  }

}
