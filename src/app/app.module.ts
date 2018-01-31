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
import { ParrainageGainPage } from '../pages/parrainage-gain/parrainage-gain';
import { MapPage } from '../pages/map/map';
import { ChooseHomePage } from '../pages/choose-home/choose-home';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';
import { FirstloginPage } from '../pages/firstlogin/firstlogin';
import { FirstloginTypePage } from '../pages/firstlogin-type/firstlogin-type';

import { PrestaListPageModule } from '../pages/presta-list/presta-list.module';
import { PrestaRatingsPageModule } from '../pages/presta-ratings/presta-ratings.module';
import { PrestaRdvPageModule } from '../pages/presta-rdv/presta-rdv.module';
import { ParrainagePageModule } from '../pages/parrainage/parrainage.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook'
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { GeocoderProvider } from '../providers/geocoder/geocoder';
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
    //PrestaListPage,
    FirstloginPage,
    FirstloginTypePage,
    ParrainageGainPage,
    MapPage,
    ChooseHomePage,
    AutocompletePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PrestaListPageModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    PrestaRatingsPageModule,
    PrestaRdvPageModule,
    ParrainagePageModule
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
    //PrestaListPage,
    FirstloginPage,
    FirstloginTypePage,
    ParrainageGainPage,
    MapPage,
    ChooseHomePage,
    AutocompletePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    GooglePlus,
    Geolocation,
    GeocoderProvider,
    NativeGeocoder
  ]
})
export class AppModule {}
