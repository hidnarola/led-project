import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './_layouts/header/header.component';
import { FooterComponent } from './_layouts/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './content/home/home.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/forgot-password/reset-password/reset-password.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { UsersComponent } from './admin/users/users.component';
import { SignSetupComponent } from './admin/sign-setup/sign-setup.component';
import { AdminLogoutComponent } from './admin/admin-logout/admin-logout.component';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

// Notification or Alert
import { NotifierModule, NotifierOptions } from 'angular-notifier';

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
import { MySignsComponent } from './content/my-signs/my-signs.component';
import { ViewScheduleComponent } from './content/schedules/view-schedule/view-schedule.component';
import { SendScheduleComponent } from './content/schedules/send-schedule/send-schedule.component';
import { SidebarComponent } from './_layouts/sidebar/sidebar.component';
import { AdminLayoutComponent } from './_layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './_layouts/user-layout/user-layout.component';

export function tokenGetter() {
  return localStorage.getItem('access-token');
}


/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 5
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    // FileSelectDirective,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
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
    ManageSignComponent,
    MySignsComponent,
    ViewScheduleComponent,
    SendScheduleComponent,
    SidebarComponent,
    AdminLayoutComponent,
    UserLayoutComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    CheckboxModule, RadioButtonModule,
    CalendarModule, FileUploadModule,
    DropdownModule, MultiSelectModule,
    // DataTableModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['192.168.100.42:8080', '192.168.100.42:8081', 'clientapp.narola.online:2220'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    }),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [Config,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
