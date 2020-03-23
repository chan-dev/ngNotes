import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ChipsModule } from 'primeng/chips';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SimplebarAngularModule,
    ChipsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AutoCompleteModule,
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    TooltipModule,
    BsDatepickerModule,
    ModalModule,
    SimplebarAngularModule,
    ChipsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AutoCompleteModule,
  ],
})
export class SharedModule {}
