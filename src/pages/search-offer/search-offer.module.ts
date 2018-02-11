import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchOfferPage } from './search-offer';

@NgModule({
  declarations: [
    SearchOfferPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchOfferPage),
  ],
})
export class SearchOfferPageModule {}
