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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // set our app's pages

    this.pages = [
      { title: 'Accueil', component: HomepagePage },
      { title: 'Se déconnecter', component: LogoutPage },
      { title: 'Adresse', component: SetAddressPage }
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

    this.clientpages.push({ title: 'Les prestations', component: DashboardPage });
    this.clientpages.push({ title: 'Mes réservations', component: PrestaRdvPage });
    this.clientpages.push({ title: 'Se déconnecter', component: LogoutPage });
    this.clientpages.push({ title: 'Mon espace ambassadeur', component: AmbassadorPage });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
