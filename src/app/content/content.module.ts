import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ContentRoutingModule } from './content-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ContentRoutingModule,
        CalendarModule
    ],
    declarations: [
    ]
})
export class ContentModule { }
