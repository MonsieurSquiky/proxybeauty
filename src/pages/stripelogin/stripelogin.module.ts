import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StripeloginPage } from './stripelogin';

@NgModule({
  declarations: [
    StripeloginPage,
  ],
  imports: [
    IonicPageModule.forChild(StripeloginPage),
  ],
})
export class StripeloginPageModule {}
