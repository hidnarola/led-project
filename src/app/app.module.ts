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
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { UsersComponent } from './admin/users/users.component';
import { SignSetupComponent } from './admin/sign-setup/sign-setup.component';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { TabViewModule } from 'primeng/tabview';


// Spinner
import { NgxSpinnerModule } from 'ngx-spinner';
// Pagination
import { NgxPaginationModule } from 'ngx-pagination';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';

// Notification or Alert
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { NgxPermissionsModule } from 'ngx-permissions';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtInterceptor } from './shared/jwt.intersepter';
import { CreateUserComponent } from './admin/users/create-user/create-user.component';
import { Config } from './shared/config';

import { SidebarComponent } from './_layouts/sidebar/sidebar.component';
import { UserLayoutComponent } from './_layouts/user-layout/user-layout.component';

import { SchedulesComponent } from './content/schedules/schedules.component';
import { PlaylistsComponent } from './content/playlists/playlists.component';
import { CreateScheduleComponent } from './content/schedules/create-schedule/create-schedule.component';
import { MySignsComponent } from './content/my-signs/my-signs.component';
import { ViewScheduleComponent } from './content/schedules/view-schedule/view-schedule.component';
import { SendScheduleComponent } from './content/schedules/send-schedule/send-schedule.component';
import { DeleteScheduleComponent } from './content/schedules/delete-schedule/delete-schedule.component';
import { ProfileComponent } from './content/profile/profile.component';

import { FileManagerComponent } from './admin/file-manager/file-manager.component';
import { CreateSetupComponent } from './admin/sign-setup/create-setup/create-setup.component';
import { ManageSignComponent } from './admin/users/manage-sign/manage-sign.component';
import { AnnouncementService } from './shared/announcement.service';
import { AddAnnouncementComponent } from './admin/add-announcement/add-announcement.component';
import { AnnouncementComponent } from './admin/announcement/announcement.component';

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
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        HomeComponent,
        ForgotPasswordComponent,
        AdminHomeComponent,
        UsersComponent,
        SignSetupComponent,
        CreateUserComponent,
        SchedulesComponent,
        PlaylistsComponent,
        CreateScheduleComponent,
        CreateSetupComponent,
        ManageSignComponent,
        MySignsComponent,
        ViewScheduleComponent,
        SendScheduleComponent,
        DeleteScheduleComponent,
        SidebarComponent,
        UserLayoutComponent,
        FileManagerComponent,
        ProfileComponent,
        AnnouncementComponent,
        AddAnnouncementComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CheckboxModule,
        RadioButtonModule,
        InputTextareaModule,
        CalendarModule,
        FileUploadModule,
        DropdownModule,
        MultiSelectModule,
        ConfirmDialogModule,
        StepsModule,
        InputSwitchModule,
        DialogModule,
        InputMaskModule,
        TabViewModule,
        NgxSpinnerModule,
        NgxPaginationModule,
        NgxPermissionsModule.forRoot(),
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        HttpModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ['192.168.100.42:8080', '192.168.100.42:2220', 'clientapp.narola.online:2220', '123.201.110.194:2220'],
                blacklistedRoutes: ['localhost:4000/api/auth']
            }
        }),
        NotifierModule.withConfig(customNotifierOptions)
    ],
    providers: [
        Config,
        ConfirmationService,
        AnnouncementService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
