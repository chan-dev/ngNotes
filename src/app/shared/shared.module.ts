import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ChipsModule } from 'primeng/chips';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    SimplebarAngularModule,
    ChipsModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    TooltipModule,
    SimplebarAngularModule,
    ChipsModule,
    FormsModule,
  ],
})
export class SharedModule {}
