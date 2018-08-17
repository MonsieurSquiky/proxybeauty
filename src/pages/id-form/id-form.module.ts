import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdFormPage } from './id-form';

@NgModule({
  declarations: [
    IdFormPage,
  ],
  imports: [
    IonicPageModule.forChild(IdFormPage),
  ],
})
export class IdFormPageModule {}
