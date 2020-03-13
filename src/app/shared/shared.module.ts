import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [],
  imports: [CommonModule, FontAwesomeModule, TooltipModule.forRoot()],
  exports: [CommonModule, FontAwesomeModule, TooltipModule],
})
export class SharedModule {}
