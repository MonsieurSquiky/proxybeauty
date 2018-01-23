import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';


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
import { ParrainageGainPage } from '../pages/parrainage-gain/parrainage-gain';
import { MapPage } from '../pages/map/map';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook'
import { Geolocation } from '@ionic-native/geolocation';
//import { DatabaseserviceProvider } from '../providers/databaseservice/databaseservice';


export const firebaseConfig = {
    production: false,
    firebase : {
        apiKey: "AIzaSyALQnjd3NpF0TI7P4JCUFAgWSs4yZ5VRF4",
        authDomain: "proxybeauty.firebaseapp.com",
        databaseURL: "https://proxybeauty.firebaseio.com",
        projectId: "proxybeauty",
        storageBucket: "proxybeauty.appspot.com",
        messagingSenderId: "1090914691423"
    }
};

var config = {
  apiKey: "AIzaSyALQnjd3NpF0TI7P4JCUFAgWSs4yZ5VRF4",
  authDomain: "proxybeauty.firebaseapp.com",
  databaseURL: "https://proxybeauty.firebaseio.com",
  projectId: "proxybeauty",
  storageBucket: "proxybeauty.appspot.com",
  messagingSenderId: "1090914691423"
};


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
    ParrainagePage,
    ParrainageGainPage,
    MapPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
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
    ParrainagePage,
    ParrainageGainPage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    GooglePlus,
    Geolocation
  ]
})
export class AppModule {}
