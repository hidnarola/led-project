import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchedulesService } from 'src/app/shared/schedules.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger = new Subject();
    playlist: any = [];
    constructor(
        private service: SchedulesService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            destroy: true,
            pageLength: 10,
            order: [0, 'desc']
        };
        this.getPlaylistSchedules();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    getPlaylistSchedules() {
        this.spinner.show();
        this.service.getPlaylist().subscribe(res => {
            this.playlist = [];
            this.playlist = res;
            this.dtTrigger.next();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

}
