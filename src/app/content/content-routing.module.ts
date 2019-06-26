import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { CreateScheduleComponent } from './schedules/create-schedule/create-schedule.component';
import { ViewScheduleComponent } from './schedules/view-schedule/view-schedule.component';
import { SendScheduleComponent } from './schedules/send-schedule/send-schedule.component';
import { MySignsComponent } from './my-signs/my-signs.component';
import { AuthGuard } from '../auth.guard';
import { UserLayoutComponent } from '../_layouts/user-layout/user-layout.component';
import { PlaylistsComponent } from './playlists/playlists.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent,
    },
    {
        path: 'schedules', component: SchedulesComponent,
    },
    {
        path: 'schedule/add', component: CreateScheduleComponent,
    },
    {
        path: 'schedule/edit/:id', component: CreateScheduleComponent,
    },
    {
        path: 'schedule/send', component: SendScheduleComponent,
    },
    {
        path: 'schedule/:id', component: ViewScheduleComponent,
    },
    {
        path: 'signs', component: MySignsComponent,
    },
    {
        path: 'playlist', component: PlaylistsComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentRoutingModule { }
