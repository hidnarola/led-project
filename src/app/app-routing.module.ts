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
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { UsersComponent } from './admin/users/users.component';
import { SignSetupComponent } from './admin/sign-setup/sign-setup.component';
import { AdminLogoutComponent } from './admin/admin-logout/admin-logout.component';
import { CreateUserComponent } from './admin/users/create-user/create-user.component';
import { CreateSetupComponent } from './admin/sign-setup/create-setup/create-setup.component';
import { EditSetupComponent } from './admin/sign-setup/edit-setup/edit-setup.component';
import { EditUserComponent } from './admin/users/edit-user/edit-user.component';
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
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
            { path: 'dashboard', component: AdminHomeComponent, canActivate: [AdminAuthGuard] },
            { path: 'profile', component: AdminProfileComponent, canActivate: [AdminAuthGuard] },
            { path: 'sign-setup', component: SignSetupComponent, canActivate: [AdminAuthGuard] },
            { path: 'file-manager', component: FileManagerComponent, canActivate: [AdminAuthGuard] },
            { path: 'sign-setup/add', component: CreateSetupComponent, canActivate: [AdminAuthGuard] },
            { path: 'sign-setup/edit/:id', component: EditSetupComponent, canActivate: [AdminAuthGuard] },
            { path: 'users', component: UsersComponent, canActivate: [AdminAuthGuard] },
            { path: 'user/add', component: CreateUserComponent, canActivate: [AdminAuthGuard] },
            { path: 'user/edit/:id', component: CreateUserComponent, canActivate: [AdminAuthGuard] },
            { path: 'user/sign/:id', component: ManageSignComponent, canActivate: [AdminAuthGuard] },
            { path: 'announcement', component: AddAnnouncementComponent, canActivate: [AdminAuthGuard] }
        ]
    },
    // // *** User ***
    {
        path: 'user',
        component: UserLayoutComponent,
        children: [
            {
                path: 'home', component: HomeComponent, canActivate: [AuthGuard],
            },
            {
                path: 'profile', component: ProfileComponent, canActivate: [AuthGuard],
            },
            {
                path: 'schedules', component: SchedulesComponent,
                canActivate: [AuthGuard, NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['PREV_02', 'PREV_03', 'PREV_04', 'ROLE_USER'],
                    }
                }
            },
            {
                path: 'schedule/add', component: CreateScheduleComponent,
                canActivate: [AuthGuard, NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['PREV_02', 'ROLE_USER'],
                    }
                }
            },
            {
                path: 'schedule/edit/:id', component: EditScheduleComponent,
                canActivate: [AuthGuard, NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['PREV_03', 'ROLE_USER'],
                    }
                }
            },
            {
                path: 'schedule/send', component: SendScheduleComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'signss/deleteSchedule', component: DeleteScheduleComponent,
                canActivate: [AuthGuard, NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['PREV_04', 'ROLE_USER'],
                    }
                }
            },
            {
                path: 'schedule/:id', component: ViewScheduleComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'signs', component: MySignsComponent,
                canActivate: [AuthGuard]
            },
        ]
    },
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'logout', component: AdminLogoutComponent },
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
