import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import firebase from 'firebase';
/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public loadingCtrl:LoadingController, public navCtrl: NavController, public navParams: NavParams) {
      let loading = this.loadingCtrl.create({
      content: 'Déconnexion...'
      });

      loading.present();
      firebase.auth().signOut().then(function() {
          // Sign-out successful.

          navCtrl.setRoot(HelloIonicPage);
          loading.dismiss();
        }, function(error) {
          // An error happened.
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

}
