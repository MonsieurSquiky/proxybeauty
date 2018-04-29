import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RdvHistoryPage } from './rdv-history';

@NgModule({
  declarations: [
    RdvHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(RdvHistoryPage),
  ],
})
export class RdvHistoryPageModule {}
