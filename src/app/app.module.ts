import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './content/home/home.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/forgot-password/reset-password/reset-password.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { UsersComponent } from './admin/users/users.component';
import { SignSetupComponent } from './admin/sign-setup/sign-setup.component';
import { AdminLogoutComponent } from './admin/admin-logout/admin-logout.component';

import { JwtModule } from '@auth0/angular-jwt';
import { JwtInterceptor } from './shared/jwt.intersepter';
import { CreateUserComponent } from './admin/users/create-user/create-user.component';
import { Config } from './shared/config';
import { SchedulesComponent } from './content/schedules/schedules.component';
import { CreateScheduleComponent } from './content/schedules/create-schedule/create-schedule.component';
import { EditScheduleComponent } from './content/schedules/edit-schedule/edit-schedule.component';
import { EditUserComponent } from './admin/users/edit-user/edit-user.component';
import { CreateSetupComponent } from './admin/sign-setup/create-setup/create-setup.component';
import { EditSetupComponent } from './admin/sign-setup/edit-setup/edit-setup.component';
import { ManageSignComponent } from './admin/users/manage-sign/manage-sign.component';
export function tokenGetter() {
  return localStorage.getItem('access-token');
}

@NgModule({
  declarations: [
    AppComponent,
    FileSelectDirective,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    AdminHeaderComponent,
    UsersComponent,
    SignSetupComponent,
    AdminLogoutComponent,
    CreateUserComponent,
    SchedulesComponent,
    CreateScheduleComponent,
    EditScheduleComponent,
    EditUserComponent,
    CreateSetupComponent,
    EditSetupComponent,
    ManageSignComponent
  ],
  imports: [
    BrowserModule,
    DataTableModule,
    DataTablesModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['192.168.100.42:8080'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    })
  ],
  providers: [Config,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
