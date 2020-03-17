import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SimplebarAngularModule } from 'simplebar-angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    SimplebarAngularModule,
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    TooltipModule,
    SimplebarAngularModule,
  ],
})
export class SharedModule {}
