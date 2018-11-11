import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmbassadorRankPage } from './ambassador-rank';

@NgModule({
  declarations: [
    AmbassadorRankPage,
  ],
  imports: [
    IonicPageModule.forChild(AmbassadorRankPage),
  ],
})
export class AmbassadorRankPageModule {}
