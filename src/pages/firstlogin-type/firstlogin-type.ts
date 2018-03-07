import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
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

    constructor(public navCtrl: NavController,
                private fdb: AngularFireDatabase,
                public navParams: NavParams,
                private modalCtrl:ModalController,
                public alertCtrl: AlertController) {

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

    chooseType(statut) {
        var ref = this.fdb.database.ref("/users/"+ this.uid);
        var obj = this;

        ref.update({
          statut: statut,
          setupStep: 1
        }).then(function() {
          obj.navCtrl.push(FirstloginPage);
        }).catch(function(error) {
          // An error happened.
          let alertVerification = obj.alertCtrl.create({
            title: "Echec",
            subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
            buttons: ['OK']
          });
          alertVerification.present();
        });
        //this.navCtrl.push(FirstloginPage);
    }

}
