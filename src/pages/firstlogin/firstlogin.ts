import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { SetAddressPage } from '../set-address/set-address';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the FirstloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firstlogin',
  templateUrl: 'firstlogin.html',
})
export class FirstloginPage {
    firstname: string;
    lastname: string;
    uid: string;

    constructor(public navCtrl: NavController, private fdb: AngularFireDatabase, public navParams: NavParams) {
        var obj = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });
    }

    saveName(firstname, lastname) {
        var ref = this.fdb.database.ref("/users/"+ this.uid);

        ref.update({
          firstname: firstname,
          lastname: lastname
        });
        this.navCtrl.push(SetAddressPage);
    }



}
