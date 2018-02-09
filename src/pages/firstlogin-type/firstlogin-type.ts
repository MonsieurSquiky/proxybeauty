import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController} from 'ionic-angular';
import {AutocompletePage} from '../autocomplete/autocomplete';
import firebase from 'firebase';
import { FirstloginPage } from '../firstlogin/firstlogin';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the FirstloginTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firstlogin-type',
  templateUrl: 'firstlogin-type.html',
})
export class FirstloginTypePage {
    uid: string;

    constructor(public navCtrl: NavController, private fdb: AngularFireDatabase, public navParams: NavParams, private modalCtrl:ModalController) {
    this.address = {
      place: ''
    };
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

    address;




    chooseType(statut) {
        var ref = this.fdb.database.ref("/users/"+ this.uid);

        ref.update({
          statut: statut
        });
        this.navCtrl.push(FirstloginPage);
    }

}
