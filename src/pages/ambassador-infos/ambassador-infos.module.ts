import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmbassadorInfosPage } from './ambassador-infos';

@NgModule({
  declarations: [
    AmbassadorInfosPage,
  ],
  imports: [
    IonicPageModule.forChild(AmbassadorInfosPage),
  ],
})
export class AmbassadorInfosPageModule {}
