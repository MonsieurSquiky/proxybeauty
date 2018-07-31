import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PrestaBoardPage } from '../pages/presta-board/presta-board';
import { FilterPage } from '../pages/filter/filter';
//import { ParrainageGainPage } from '../pages/parrainage-gain/parrainage-gain';
//import { MapPage } from '../pages/map/map';
//import { ChooseHomePage } from '../pages/choose-home/choose-home';
import { SearchOfferPage } from '../pages/search-offer/search-offer';
import { ResultOfferPage } from '../pages/result-offer/result-offer';
import { ParrainageGainPage } from '../pages/parrainage-gain/parrainage-gain';
import { PrestaListPage } from '../pages/presta-list/presta-list';
import { PrestaRatingsPage } from '../pages/presta-ratings/presta-ratings';


import { PrestaRdvPage } from '../pages/presta-rdv/presta-rdv';
import { HorairePage } from '../pages/horaire/horaire';
//import { ParrainagePage } from '../pages/parrainage/parrainage';
import { SchedulePage } from '../pages/schedule/schedule';
import { AmbassadorPage } from '../pages/ambassador/ambassador';
import { AmbassadorInfosPage } from '../pages/ambassador-infos/ambassador-infos';
//import { StripeTestPage } from '../pages/stripe-test/stripe-test';
//import { StripeloginPage } from '../pages/stripelogin/stripelogin';
import { BookingPage } from '../pages/booking/booking';
import { BoutiquePage } from '../pages/boutique/boutique';
import { ProductPage } from '../pages/product/product';
import { ProfilePage } from '../pages/profile/profile';


//import { AmbassadorPage } from '../pages/ambassador/ambassador';

import { AutocompletePageModule } from '../pages/autocomplete/autocomplete.module';
import { FirstloginPageModule } from '../pages/firstlogin/firstlogin.module';
import { FirstloginTypePageModule } from '../pages/firstlogin-type/firstlogin-type.module';
import { SetAddressPageModule } from '../pages/set-address/set-address.module';

import { LogoutPageModule } from '../pages/logout/logout.module';
import { PaybookingPageModule } from '../pages/paybooking/paybooking.module';
import { ProfilepicPageModule } from '../pages/profilepic/profilepic.module';
import { SetParrainPageModule } from '../pages/set-parrain/set-parrain.module';
import { ConditionsPageModule } from '../pages/conditions/conditions.module';
import { FormsModule } from '@angular/forms';
import { AddressFormPageModule } from '../pages/address-form/address-form.module';
import { GiftPageModule } from '../pages/gift/gift.module';
import { BankaccountPageModule } from '../pages/bankaccount/bankaccount.module';
import { SavPageModule } from '../pages/sav/sav.module';
import { RatePageModule } from '../pages/rate/rate.module';
import { RdvPageModule } from '../pages/rdv/rdv.module';
import { RdvHistoryPageModule } from '../pages/rdv-history/rdv-history.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook'
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Stripe } from '@ionic-native/stripe';
import { GeocoderProvider } from '../providers/geocoder/geocoder';
import { FcmProvider } from '../providers/fcm/fcm';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

//import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
//import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/*export function setTranslateLoader(http: HttpClient) {
 return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}*/
//import { DatabaseserviceProvider } from '../providers/databaseservice/databaseservice';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';

var config = {
  apiKey: "AIzaSyCvZde2dbNMl8uJzYhI6EMVnFdewpObNZA",
  authDomain: "proxybeauty-2.firebaseapp.com",
  databaseURL: "https://proxybeauty-2.firebaseio.com",
  projectId: "proxybeauty-2",
  storageBucket: "proxybeauty-2.appspot.com",
  messagingSenderId: "624687797142"
};



@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    DashboardPage,
    PrestaBoardPage,
    FilterPage,
    PrestaListPage,
    SearchOfferPage,
    ResultOfferPage,
    PrestaRatingsPage,
    PrestaRdvPage,
    //ParrainagePage,
    SchedulePage,
    ParrainageGainPage,
    AmbassadorPage,
    AmbassadorInfosPage,
    //StripeTestPage,
    //StripeloginPage,
    BookingPage,
    BoutiquePage,
    ProductPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    /*
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }),
    */
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
    PaybookingPageModule,
    ProfilepicPageModule,
    SetParrainPageModule,
    ConditionsPageModule,
    LogoutPageModule,
    AddressFormPageModule,
    GiftPageModule,
    BankaccountPageModule,
    SavPageModule,
    RatePageModule,
    RdvHistoryPageModule,
    RdvPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    DashboardPage,
    PrestaBoardPage,
    PrestaListPage,
    FilterPage,
    //SchedulePage,
    SearchOfferPage,
    ResultOfferPage,
    PrestaRatingsPage,
    PrestaRdvPage,
    //ParrainagePage,
    SchedulePage,
    ParrainageGainPage,
    AmbassadorPage,
    AmbassadorInfosPage,
    BookingPage,
    BoutiquePage,
    ProductPage,
    ProfilePage
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
    Camera,
    Firebase,
    FcmProvider
  ]
})
export class AppModule {}
