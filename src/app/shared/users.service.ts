import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

import { Config } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiURL = this.config.apiURL;
  constructor(private http: HttpClient, private config: Config) { }

  getAllUsers() {
    const uri = this.apiURL + 'leddesigner/user/getAllUsers';

    return this.http
      .get(uri)
      .pipe(map(res => {
        console.log(res);
        return res;
      }
      ));
  }

  getUserProfile(id) {
    const uri = this.apiURL + 'leddesigner/user/getProfile?userid=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }
      ));
  }

  deleteProfile(id) {

    // Not implemented
    const uri = this.apiURL + 'leddesigner/user/deleteProfile?userid=' + id;

    return this.http
      .get(uri)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }
      ));
  }

  updateProfile(data) {
    const uri = this.apiURL + 'leddesigner/user/updateProfile';
    const profile = {
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
    console.log(profile);
    return this.http
      .put(uri, profile)
      .map(res => {
        console.log(res);
        return res;
      }
      );
  }

}
