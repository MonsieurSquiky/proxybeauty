import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrestaBoardPage } from '../presta-board/presta-board';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the PrestaRdvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
    name: 'prestardv'
})
@Component({
  selector: 'page-presta-rdv',
  templateUrl: 'presta-rdv.html',
})
export class PrestaRdvPage {
  uid;
  rdvList= [];
  dates = [];
  daysName = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
  months = ['Jan', 'Fév', 'Mar', 'Av', 'Mai', 'J', 'Jui', 'A', 'Sep', 'Oct', 'Nov', 'Déc'];
  now;
  address;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase,) {
      var obj = this;
      this.now = new Date();

      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;

            let addressRef = fdb.database.ref('/users/'+user.uid+'/address');
            addressRef.on('value', function(snapshot) {
                obj.address = (snapshot.val().place) ? snapshot.val().place : false;
            });

            let rdvRef = fdb.database.ref('/user-rdv/'+obj.uid);
            rdvRef.on('value', function(snapshot) {
                snapshot.forEach( function(childSnapshot) {
                    if (childSnapshot.val().timestamp > obj.now.getTime())
                        obj.rdvList.push(childSnapshot.val());
                    // else detruire le rdv

                  return false;
                });

                obj.rdvList.sort(function (a, b) {
                  return a.timestamp - b.timestamp;
                });

                obj.setRdvDays();
            });
            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrestaRdvPage');
  }

  goBoard() {
      this.navCtrl.setRoot(PrestaBoardPage);
  }

  setRdvDays() {
      for(let rdv of this.rdvList) {
          let rdvDate = new Date(rdv.timestamp);
          rdv.hour = rdvDate.getHours();
          rdv['date'] = [rdvDate.getDay(), rdvDate.getDate(), rdvDate.getMonth(), rdv.timestamp];
          if (!isItemInArray(this.dates, rdv['date']))
            this.dates.push(rdv['date']);
      }
  }

  diffdate(d1,d2){
    var WNbJours = d2 - d1;
    return Math.ceil(WNbJours/(1000*60*60*24));
  }

}

function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1] && array[i][2] == item[2]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}
