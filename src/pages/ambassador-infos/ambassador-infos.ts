import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { PaybookingPage } from '../paybooking/paybooking';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the AmbassadorInfosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-ambassador-infos',
  templateUrl: 'ambassador-infos.html',
})
export class AmbassadorInfosPage {
  uid;
  isAmbassador: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    var obj = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          obj.uid = user.uid;
          firebase.database().ref('/users/'+user.uid+'/ambassador').on('value', function(snapshot) {
              obj.isAmbassador = snapshot.val();
              console.log(snapshot.val());
          });
        } else {
          // No user is signed in.
        }
      });
  }

  submitAmbassador() {
      //this.navCtrl.push(PaybookingPage, { prix: 99, type: 'abonnement'});
      let updates = {};
      updates['/parrains/' + this.uid+'/ambassador'] = true;
      updates['/users/' + this.uid + '/ambassador'] = true;
       this.fdb.database.ref().update(updates);
  }

}
