import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    formdata:any;
    constructor(
        private http: HttpClient
    ) { }

    getAllUsers(): any {
        const uri = '/leddesigner/user/getAllUsers';
        return this.http.get(uri);
    }

    getParentUsers() {
        const uri = '/leddesigner/user/get-users';
        return this.http.get(uri);
    }

    getUsers(): any {
        const uri = '/leddesigner/user/get-users';
        return this.http.get(uri);
    }

    getAllPermission() {
        const uri = '/leddesigner/user/get-all-permission';
        return this.http.get(uri);
    }

    getUserProfile(id) {
        const uri = '/leddesigner/user/getProfile?userid=' + id;

        return this.http
            .get(uri)
            .pipe(map(res => {
                return res;
            }
            ));
    }

    deleteUser(id) {
        const uri = '/leddesigner/user/delete?id=' + id;
        return this.http
            .delete(uri)
            .pipe(map(res => {
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
        return this.http.put(uri, profile)
            .map(res => {
                return res;
            }
            );
    }

}
