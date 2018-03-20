import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoutiquePage } from './boutique';

@NgModule({
  declarations: [
    BoutiquePage,
  ],
  imports: [
    IonicPageModule.forChild(BoutiquePage),
  ],
})
export class BoutiquePageModule {}
