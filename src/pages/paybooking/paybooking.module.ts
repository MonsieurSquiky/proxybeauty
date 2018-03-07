import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaybookingPage } from './paybooking';

@NgModule({
  declarations: [
    PaybookingPage,
  ],
  imports: [
    IonicPageModule.forChild(PaybookingPage),
  ],
})
export class PaybookingPageModule {}
