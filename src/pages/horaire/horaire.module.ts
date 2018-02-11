import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HorairePage } from './horaire';

@NgModule({
  declarations: [
    HorairePage,
  ],
  imports: [
    IonicPageModule.forChild(HorairePage),
  ],
})
export class HorairePageModule {}
