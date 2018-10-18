import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { UserLayoutComponent } from '../_layouts/user-layout/user-layout.component';
@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  declarations: [

  ]
})
export class ContentModule { }
