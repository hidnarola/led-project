import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

// User
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/forgot-password/reset-password/reset-password.component';
import { HomeComponent } from './content/home/home.component';
import { SchedulesComponent } from './content/schedules/schedules.component';
import { CreateScheduleComponent } from './content/schedules/create-schedule/create-schedule.component';
import { EditScheduleComponent } from './content/schedules/edit-schedule/edit-schedule.component';
import { ViewScheduleComponent } from './content/schedules/view-schedule/view-schedule.component';
import { SendScheduleComponent } from './content/schedules/send-schedule/send-schedule.component';
import { MySignsComponent } from './content/my-signs/my-signs.component';

// Admin
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { UsersComponent } from './admin/users/users.component';
import { SignSetupComponent } from './admin/sign-setup/sign-setup.component';
import { AdminLogoutComponent } from './admin/admin-logout/admin-logout.component';
import { CreateUserComponent } from './admin/users/create-user/create-user.component';
import { CreateSetupComponent } from './admin/sign-setup/create-setup/create-setup.component';
import { EditSetupComponent } from './admin/sign-setup/edit-setup/edit-setup.component';
import { ManageSignComponent } from './admin/users/manage-sign/manage-sign.component';
import { FileManagerComponent } from './admin/file-manager/file-manager.component';

// Guard
import { AuthGuard } from './auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';

// Layout
import { UserLayoutComponent } from './_layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './_layouts/admin-layout/admin-layout.component';
import { DeleteScheduleComponent } from './content/schedules/delete-schedule/delete-schedule.component';
import { ProfileComponent } from './content/profile/profile.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddAnnouncementComponent } from './admin/add-announcement/add-announcement.component';


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'forgot', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    {
        path: 'admin',
        component: UserLayoutComponent,
        canActivate: [AdminAuthGuard],
        children: [
            { path: 'dashboard', component: AdminHomeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'sign-setup', component: SignSetupComponent },
            { path: 'file-manager', component: FileManagerComponent },
            { path: 'sign-setup/add', component: CreateSetupComponent },
            { path: 'sign-setup/edit/:id', component: CreateSetupComponent },
            { path: 'users', component: UsersComponent },
            { path: 'user/add', component: CreateUserComponent },
            { path: 'user/edit/:id', component: CreateUserComponent },
            { path: 'user/sign/:id', component: ManageSignComponent },
            { path: 'announcement', component: AddAnnouncementComponent }
        ]
    },
    // // *** User ***
    {
        path: 'user',
        component: UserLayoutComponent,
        canActivate: [AdminAuthGuard],
        canActivateChild: [NgxPermissionsGuard],
        children: [
            {
                path: 'home', component: HomeComponent,
            },
            {
                path: 'profile', component: ProfileComponent
            },
            {
                path: 'schedules', component: SchedulesComponent,
                data: {
                    permissions: {
                        only: ['PREV_00', 'ROLE_USER']
                    }
                }
            },
            {
                path: 'schedule/add', component: CreateScheduleComponent,
                data: {
                    permissions: {
                        only: ['PREV_02', 'ROLE_USER']
                    }
                }
            },
            {
                path: 'schedule/edit/:id', component: EditScheduleComponent,
                data: {
                    permissions: {
                        only: ['PREV_03', 'ROLE_USER']
                    }
                }
            },
            {
                path: 'schedule/send', component: SendScheduleComponent
            },
            {
                path: 'signss/deleteSchedule', component: DeleteScheduleComponent,
                data: {
                    permissions: {
                        only: ['PREV_04', 'ROLE_USER']
                    }
                }
            },
            {
                path: 'schedule/:id', component: ViewScheduleComponent
            },
            {
                path: 'signs', component: MySignsComponent
            },
        ]
    },
    { path: '**', redirectTo: 'login' }
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
