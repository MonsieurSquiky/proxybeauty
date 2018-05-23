import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankaccountPage } from './bankaccount';

@NgModule({
  declarations: [
    BankaccountPage,
  ],
  imports: [
    IonicPageModule.forChild(BankaccountPage),
  ],
})
export class BankaccountPageModule {}
