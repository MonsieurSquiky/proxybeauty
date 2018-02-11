import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { SearchOfferPage } from '../search-offer/search-offer';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  num : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
      this.menu.enable(true);
      var page = this;
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            page.num = user.email;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

}
