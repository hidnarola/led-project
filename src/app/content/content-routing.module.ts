import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { CreateScheduleComponent } from './schedules/create-schedule/create-schedule.component';
import { EditScheduleComponent } from './schedules/edit-schedule/edit-schedule.component';
import { ViewScheduleComponent } from './schedules/view-schedule/view-schedule.component';
import { SendScheduleComponent } from './schedules/send-schedule/send-schedule.component';
// import { DeleteScheduleComponent } from './schedules/delete-schedule/delete-schedule.component';
import { MySignsComponent } from './my-signs/my-signs.component';

import { AuthGuard } from '../auth.guard';

import { UserLayoutComponent } from '../_layouts/user-layout/user-layout.component';


const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [{
      path: '', redirectTo: 'home', pathMatch: 'full'
    },
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
      path: 'schedule/edit/:id', component: EditScheduleComponent,
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
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
