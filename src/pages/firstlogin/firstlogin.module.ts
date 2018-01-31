import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstloginPage } from './firstlogin';

@NgModule({
  declarations: [
    FirstloginPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstloginPage),
  ],
})
export class FirstloginPageModule {}
