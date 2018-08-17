import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PrestaBoardPage } from '../pages/presta-board/presta-board';
import { FilterPage } from '../pages/filter/filter';
import { PrestaListPage } from '../pages/presta-list/presta-list';
import { PrestaRatingsPage } from '../pages/presta-ratings/presta-ratings';
import { PrestaRdvPage } from '../pages/presta-rdv/presta-rdv';
import { ParrainagePage } from '../pages/parrainage/parrainage';
import { ParrainageGainPage } from '../pages/parrainage-gain/parrainage-gain';
import { MapPage } from '../pages/map/map';
import { ChooseHomePage } from '../pages/choose-home/choose-home';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';
import { FirstloginPage } from '../pages/firstlogin/firstlogin';
import { FirstloginTypePage } from '../pages/firstlogin-type/firstlogin-type';
import { SetAddressPage } from '../pages/set-address/set-address';
import { SchedulePage } from '../pages/schedule/schedule';
import { SearchOfferPage } from '../pages/search-offer/search-offer';
import { ResultOfferPage } from '../pages/result-offer/result-offer';
import { LogoutPage } from '../pages/logout/logout';
import { HomepagePage } from '../pages/homepage/homepage';
import { StripeloginPage } from '../pages/stripelogin/stripelogin';
import { StripeTestPage } from '../pages/stripe-test/stripe-test';
import { BookingPage } from '../pages/booking/booking';
import { PaybookingPage } from '../pages/paybooking/paybooking';
import { ProfilepicPage } from '../pages/profilepic/profilepic';
import { AmbassadorInfosPage } from '../pages/ambassador-infos/ambassador-infos';
import { AmbassadorPage } from '../pages/ambassador/ambassador';
import { ProfilePage } from '../pages/profile/profile';
import { BoutiquePage } from '../pages/boutique/boutique';
import { RdvPage } from '../pages/rdv/rdv';
import { GiftPage } from '../pages/gift/gift';
import { SavPage } from '../pages/sav/sav';
import { ConditionsPage } from '../pages/conditions/conditions';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { TranslateService } from '@ngx-translate/core';

import { FcmProvider } from '../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HelloIonicPage;
  pages: Array<{title: string, component: any}>;
  clientpages: Array<{title: string, component: any}> = [];
  prestatairepages: Array<{title: string, component: any}> = [];


  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    //public translate: TranslateService,
    public fcm: FcmProvider,
    public toastCtrl: ToastController
  ) {
    this.initializeApp();

    // set our app's pages

    this.pages = [
      { title: 'Accueil', component: PrestaBoardPage },
      { title: 'Mon Profil', component: ProfilePage },
      { title: 'Espace Client', component: SavPage },
      { title: 'Se déconnecter', component: LogoutPage }
      /*,
      { title: 'My First List', component: ListPage },
      { title: 'Da Dashboard', component: DashboardPage },
      { title: 'Choose Freely', component: FilterPage },
      { title: 'For you, professionals', component: PrestaBoardPage },
      { title: 'My offers', component: PrestaListPage },
      { title: 'My reviews', component: PrestaRatingsPage },
      { title: 'My appointments', component: PrestaRdvPage },
      { title: 'Mon reseau', component: ParrainagePage },
      { title: 'Mon adresse', component: MapPage },
      { title: 'Emploi du temps', component: SchedulePage },
      { title: 'Trouvez offre', component: SearchOfferPage },
      { title: 'une recherche', component: ResultOfferPage } */
    ];

    this.clientpages.push({ title: 'Les Prestations', component: DashboardPage });
    this.clientpages.push({ title: 'Mes Réservations', component: RdvPage });
    this.clientpages.push({ title: 'Mon Profil', component: ProfilePage });
    this.clientpages.push({ title: 'La Boutique', component: BoutiquePage });
    this.clientpages.push({ title: 'Mes Cadeaux', component: GiftPage });
    this.clientpages.push({ title: 'Mon Espace Ambassadeur', component: AmbassadorPage });
    this.clientpages.push({ title: 'Espace Client', component: SavPage });
    this.clientpages.push({ title: 'Se déconnecter', component: LogoutPage });
    this.clientpages.push({ title: 'Conditions', component: ConditionsPage });

  }

  initializeApp() {
      const obj = this;
    //this.translate.setDefaultLang('fr');
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            // Get a FCM token
              obj.fcm.getToken(user.uid);

              // Listen to incoming messages
              obj.fcm.listenToNotifications().pipe(
                tap(msg => {
                  // show a toast
                  const toast = obj.toastCtrl.create({
                    message: msg['body'],
                    duration: 3000
                  });
                  toast.present();
                })
              )
              .subscribe();
          }
        });

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
