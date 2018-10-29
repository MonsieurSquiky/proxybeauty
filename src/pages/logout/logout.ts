import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import firebase from 'firebase';

import { FcmProvider } from '../../providers/fcm/fcm';
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

  constructor(public loadingCtrl:LoadingController, public navCtrl: NavController, public navParams: NavParams, public fcm: FcmProvider) {

  }

  ionViewDidLoad() {
      let loading = this.loadingCtrl.create({
      content: 'Déconnexion...'
      });

      loading.present();
    console.log('ionViewDidLoad LogoutPage');
    var obj = this;

    let user = firebase.auth().currentUser;
    if (user) {
        var ref = firebase.database().ref('devices/' + user.uid);
        let token = obj.fcm.currentToken;
        console.log(token);
        ref.once('value', function(snapshot) {
            if (snapshot.exists()) {
                console.log('Snapshot exist');
                if (snapshot.hasChild('tokenList')) {
                    console.log('TokenList exist');
                    let tokenList = snapshot.child('tokenList').val();
                    if (tokenList.indexOf(token) != -1) {
                        tokenList.splice(tokenList.indexOf(token), 1);
                        ref.child('tokenList').set(tokenList);
                    }
                }
            }

        }).then(function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
                
                loading.dismiss();
                obj.goHome();

              }, function(error) {
                // An error happened.
                console.debug(error);
                loading.dismiss();
                obj.goHome();
          });
       });
    }
  }

  goHome() {
      this.navCtrl.setRoot(HelloIonicPage);
  }

}
