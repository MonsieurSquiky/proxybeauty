import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RdvInfosPage } from './rdv-infos';

@NgModule({
  declarations: [
    RdvInfosPage,
  ],
  imports: [
    IonicPageModule.forChild(RdvInfosPage),
  ],
})
export class RdvInfosPageModule {}
