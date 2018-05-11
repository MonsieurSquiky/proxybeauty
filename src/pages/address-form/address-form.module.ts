import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressFormPage } from './address-form';

@NgModule({
  declarations: [
    AddressFormPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressFormPage),
  ],
})
export class AddressFormPageModule {}
