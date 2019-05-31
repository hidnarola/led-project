import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    token: any;
    constructor(
        private http: HttpClient
    ) { }

    getAllUsers(): any {
        const uri = '/leddesigner/user/getAllUsers';
        return this.http.get(uri);
    }
    getProfileLink(userId?) {
        const uri = userId ? '/leddesigner/user/profile-picture?id=' + userId : '/leddesigner/user/profile-picture';
        return this.http.get(uri, { responseType: 'text' });
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
        return this.http.get(uri);
    }

    deleteUser(id) {
        const uri = '/leddesigner/user/delete?id=' + id;
        return this.http.delete(uri);
    }

    changePassword(data) {
        const uri = '/leddesigner/user/changePassword';
        const profile = {
            userId: data.userId,
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        };
        return this.http.put(uri, profile);
    }
}
