import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PrestaBoardPage } from '../pages/presta-board/presta-board';
import { FilterPage } from '../pages/filter/filter';
import { PrestaListPage } from '../pages/presta-list/presta-list';
import { PrestaRatingsPage } from '../pages/presta-ratings/presta-ratings';
import { PrestaRdvPage } from '../pages/presta-rdv/presta-rdv';
import { ParrainagePage } from '../pages/parrainage/parrainage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    DashboardPage,
    PrestaBoardPage,
    ListPage,
    FilterPage,
    PrestaListPage,
    PrestaRatingsPage,
    PrestaRdvPage,
    ParrainagePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    DashboardPage,
    PrestaBoardPage,
    ListPage,
    FilterPage,
    PrestaListPage,
    PrestaRatingsPage,
    PrestaRdvPage,
    ParrainagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
