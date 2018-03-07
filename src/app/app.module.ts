import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PrestaBoardPage } from '../pages/presta-board/presta-board';
//import { ParrainageGainPage } from '../pages/parrainage-gain/parrainage-gain';
//import { MapPage } from '../pages/map/map';
//import { ChooseHomePage } from '../pages/choose-home/choose-home';
import { SearchOfferPage } from '../pages/search-offer/search-offer';
import { ResultOfferPage } from '../pages/result-offer/result-offer';
//import { StripeTestPage } from '../pages/stripe-test/stripe-test';
//import { StripeloginPage } from '../pages/stripelogin/stripelogin';
import { BookingPage } from '../pages/booking/booking';

//import { AmbassadorPage } from '../pages/ambassador/ambassador';

import { AutocompletePageModule } from '../pages/autocomplete/autocomplete.module';
import { FirstloginPageModule } from '../pages/firstlogin/firstlogin.module';
import { FirstloginTypePageModule } from '../pages/firstlogin-type/firstlogin-type.module';
import { SetAddressPageModule } from '../pages/set-address/set-address.module';
import { FilterPageModule } from '../pages/filter/filter.module';
import { LogoutPageModule } from '../pages/logout/logout.module';
import { ParrainageGainPageModule } from '../pages/parrainage-gain/parrainage-gain.module';
import { PrestaListPageModule } from '../pages/presta-list/presta-list.module';
import { PrestaRatingsPageModule } from '../pages/presta-ratings/presta-ratings.module';
import { PrestaRdvPageModule } from '../pages/presta-rdv/presta-rdv.module';
import { HorairePageModule } from '../pages/horaire/horaire.module';
import { ParrainagePageModule } from '../pages/parrainage/parrainage.module';
import { SchedulePageModule } from '../pages/schedule/schedule.module';
import { AmbassadorPageModule } from '../pages/ambassador/ambassador.module';
import { AmbassadorInfosPageModule } from '../pages/ambassador-infos/ambassador-infos.module';
import { PaybookingPageModule } from '../pages/paybooking/paybooking.module';
import { ProfilepicPageModule } from '../pages/profilepic/profilepic.module';
import { SetParrainPageModule } from '../pages/set-parrain/set-parrain.module';
import { ConditionsPageModule } from '../pages/conditions/conditions.module';
import {FormsModule} from '@angular/forms';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook'
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Stripe } from '@ionic-native/stripe';
import { GeocoderProvider } from '../providers/geocoder/geocoder';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

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
    DashboardPage,
    PrestaBoardPage,
    //PrestaListPage,
    //SchedulePage,
    SearchOfferPage,
    ResultOfferPage,
    //StripeTestPage,
    //StripeloginPage,
    BookingPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    PrestaListPageModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    FirstloginPageModule,
    FirstloginTypePageModule,
    //ParrainageGainPage,
    //MapPage,
    //ChooseHomePage,
    AutocompletePageModule,
    SetAddressPageModule,
    FilterPageModule,
    PrestaRatingsPageModule,
    PrestaRdvPageModule,
    ParrainagePageModule,
    SchedulePageModule,
    ParrainageGainPageModule,
    AmbassadorPageModule,
    AmbassadorInfosPageModule,
    PaybookingPageModule,
    ProfilepicPageModule,
    SetParrainPageModule,
    ConditionsPageModule,
    LogoutPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    DashboardPage,
    PrestaBoardPage,
    //PrestaListPage,

    //SchedulePage,
    SearchOfferPage,
    ResultOfferPage,

    BookingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    GooglePlus,
    Geolocation,
    GeocoderProvider,
    NativeGeocoder,
    Stripe,
    InAppBrowser,
    HTTP,
    Camera
  ]
})
export class AppModule {}
