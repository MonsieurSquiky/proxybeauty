import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StripeTestPage } from './stripe-test';

@NgModule({
  declarations: [
    StripeTestPage,
  ],
  imports: [
    IonicPageModule.forChild(StripeTestPage),
  ],
})
export class StripeTestPageModule {}
