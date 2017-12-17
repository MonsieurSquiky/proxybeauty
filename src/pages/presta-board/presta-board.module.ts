import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrestaBoardPage } from './presta-board';

@NgModule({
  declarations: [
    PrestaBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(PrestaBoardPage),
  ],
})
export class PrestaBoardPageModule {}
