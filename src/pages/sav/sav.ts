import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the SavPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sav',
  templateUrl: 'sav.html',
})
export class SavPage {
    uid;
    details;
    subject;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavPage');
  }

  sendMessage() {
      var obj = this;
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;
            firebase.database().ref('/users/'+user.uid).on('value', function(snapshot) {
                let userData = snapshot.val();
                firebase.database().ref('/sav/'+user.uid).push({
                    subject: obj.subject,
                    details: obj.details,
                    userData
                }).then(() => {
                    let alert = obj.alertCtrl.create({
                      title: "Message envoyé",
                      subTitle: "Votre message a bien été envoyé et vous recevrez une réponse sous peu.",
                      buttons: ['OK']
                    });
                    alert.present();
                });
            });
          } else {
            // No user is signed in.
          }
        });
  }

}
