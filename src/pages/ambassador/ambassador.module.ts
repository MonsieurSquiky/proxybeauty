import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmbassadorPage } from './ambassador';

@NgModule({
  declarations: [
    AmbassadorPage,
  ],
  imports: [
    IonicPageModule.forChild(AmbassadorPage),
  ],
})
export class AmbassadorPageModule {}
