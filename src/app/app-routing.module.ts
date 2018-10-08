import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// User
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './content/home/home.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/forgot-password/reset-password/reset-password.component';

import { SchedulesComponent } from './content/schedules/schedules.component';
import { CreateScheduleComponent } from './content/schedules/create-schedule/create-schedule.component';
import { EditScheduleComponent } from './content/schedules/edit-schedule/edit-schedule.component';

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

// Guard
import { AuthGuard } from './auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'admin', redirectTo: 'admin/login' },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminHomeComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/sign-setup', component: SignSetupComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/sign-setup/add', component: CreateSetupComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/sign-setup/edit/:id', component: EditSetupComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/users', component: UsersComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/user/add', component: CreateUserComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/user/edit/:id', component: EditUserComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/user/sign/:id', component: ManageSignComponent, canActivate: [AdminAuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'schedules', component: SchedulesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'schedule/add', component: CreateScheduleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'schedule/edit/:id', component: EditScheduleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signs', component: MySignsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'logout', component: AdminLogoutComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
