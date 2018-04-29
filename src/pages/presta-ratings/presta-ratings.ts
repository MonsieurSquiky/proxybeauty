import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the PrestaRatingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-presta-ratings',
  templateUrl: 'presta-ratings.html',
})
export class PrestaRatingsPage {
  uid;
  reviews = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrestaRatingsPage');
    var obj = this;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          obj.uid = user.uid;
          var ref = firebase.database().ref('reviews/' + user.uid);
            ref.on('value', function(snapshot) {
                snapshot.forEach( function(childSnapshot) {
                    obj.reviews.push(childSnapshot.val());

                  // else detruire le rdv
                  return false;
                });

                if (obj.reviews.length == 0) {
                    let alertVerification = obj.alertCtrl.create({
                      title: "Aucun commentaires",
                      subTitle: "Vous n'avez pas recu de commentaires jusqu'à présent.",
                      buttons: ['OK']
                    });
                    alertVerification.present();

                }

                obj.reviews.sort(function (a, b) {
                  return a.timestamp - b.timestamp;
                });
                obj.reviews.reverse();
            });
        }
      });
    
  }

}
