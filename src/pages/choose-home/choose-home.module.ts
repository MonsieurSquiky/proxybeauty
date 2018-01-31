import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseHomePage } from './choose-home';

@NgModule({
  declarations: [
    ChooseHomePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseHomePage),
  ],
})
export class ChooseHomePageModule {}
