import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrestaListPage } from './presta-list';

@NgModule({
  declarations: [
    PrestaListPage,
  ],
  imports: [
    IonicPageModule.forChild(PrestaListPage),
  ],
})
export class PrestaListPageModule {}
