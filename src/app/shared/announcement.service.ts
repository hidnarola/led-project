import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {

    uri = '/leddesigner/announcement/';

    constructor(
        private http: HttpClient
    ) { }

    addAnnouncement(data) {
        if (data.hasOwnProperty('id')) {
            return this.http.put(this.uri, data);
        } else {
            return this.http.post(this.uri, data);
        }
    }

    getAnnouncementById(id) {
        const url = this.uri + id;
        return this.http.get(url);
    }

    deleteAnnouncement(id) {
        const url = this.uri + '?id=' + id;
        return this.http.delete(url);
    }

    getAnnouncement(): any {
        return this.http.get(this.uri);
    }

}
