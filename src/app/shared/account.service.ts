import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { AES, enc } from 'crypto-ts';
import { Config } from '../shared/config';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    secretKey = 'ansdu3jbduwehqdjna23dwer4g667fdfk';
    role = 'ROLE_USER';
    constructor(private http: HttpClient, private config: Config) { }

    register(data) {
        const uri = '/leddesigner/user/register';
        if (data.isAdmin) {
            this.role = 'ROLE_ADMIN';
        }
        const user = {
            userid: null,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            mobno: data.phone,
            companyname: data.company,
            city: data.city,
            state: data.state,
            authorities: [
                { name: this.role }
            ]
        };

        return this.http.post(uri, user).map(res => {
            return res;
        });
    }

    activatation(activatation_key) {
        const uri = '/leddesigner/user/active/' + activatation_key;
        return this.http.get(uri).map(res => {
            return res;
        });
    }

    forgot_password(email) {
        const uri = '/leddesigner/user/forgetpassword';
        const user = {
            email: email
        };
        return this.http.post(uri, user).map(res => {
            return res;
        });
    }

    reset_password(key, newpass) {
        const uri = 'leddesigner/user/resetpassword';
        const user = {
            resetKey: key,
            newPassword: newpass
        };
        return this.http.post(uri, user).map(res => {
            return res;
        });
    }

    login(uname, pass) {
        const uri = '/login';
        const user = {
            username: uname,
            password: pass
        };
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            observe: 'response' as 'response'
        };

        return this.http.post(uri, user, httpOptions).pipe(map(res => {
            // login successful if there's a jwt token in the response
            if (res) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if (res.headers.has('Authorization')) {
                    const str = res.headers.get('Authorization');
                    const token = str.replace('Bearer ', '');
                    localStorage.setItem('user_email', uname);
                    localStorage.setItem('access-token', token);
                    return true;
                } else {
                    console.log(res.headers);
                }
            }
            return false;
        }));
    }

    logout() {
        localStorage.clear();
        return true;
    }

    dateAndTime() {
        return new Date().toLocaleString();
    }

    encPwd(str) {
        return AES.encrypt(str, this.secretKey).toString();
        // const ciphertext = CryptoTS.AES.encrypt(str, this.secretKey).toString();
        // return ciphertext;
    }

    decPwd(str) {
        return AES.decrypt(str, this.secretKey).toString(enc.Utf8);
        // const bytes  = CryptoTS.AES.decrypt(str.toString(), this.secretKey);
        // const plaintext = bytes.toString(CryptoTS.enc.Utf8);
        // return plaintext;
    }
}
