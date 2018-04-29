import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { SearchOfferPage } from '../search-offer/search-offer';
import { LogoutPage } from '../logout/logout';
import { PrestaRdvPage } from '../presta-rdv/presta-rdv';
import { ParrainageGainPage } from '../parrainage-gain/parrainage-gain';
import { AmbassadorInfosPage } from '../ambassador-infos/ambassador-infos';
import { BoutiquePage } from '../boutique/boutique';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  uid : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
      this.menu.enable(true, 'client');
  }

  ionViewDidLoad() {
    var obj = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          obj.uid = user.uid;

        } else {
          // No user is signed in.
        }
      });
  }

  getUserName() {
      var user = firebase.auth().currentUser;
      return user.displayName;
  }

  goSearch(category) {
      this.navCtrl.push(SearchOfferPage, {category: category});
  }

  goToShop() {
      this.navCtrl.push(BoutiquePage);
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.navCtrl.setRoot(page.component);
  }



}
