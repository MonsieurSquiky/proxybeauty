import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';


import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the GiftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift',
  templateUrl: 'gift.html',
})
export class GiftPage {
  uid;
  nbRdv = 0;
  nbComment = 0;
  palier = 0;
  nextStep = [3, 3, 5];
  widthBar= 0;
  giftList = [];
  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private fdb: AngularFireDatabase,
                public loadingCtrl:LoadingController,
                public alertCtrl:AlertController) {

  }

  ionViewDidLoad() {
      const obj = this;
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;
            console.log('In');
            let rdvRef = obj.fdb.database.ref('/user-rdv/' + obj.uid);
            rdvRef.on('value', function(snapshot) {
                obj.nbRdv = 0;
                obj.nbComment = 0;

                snapshot.forEach( function(childSnapshot) {
                    obj.nbRdv += 1;
                    if (childSnapshot.hasChild('review'))
                        obj.nbComment += 1;

                  return false;
                });
                obj.widthBar = Math.round((obj.nbRdv + obj.nbComment) / (obj.nextStep[0] + obj.nextStep[1]) * 100);
            });

            let palierRef = obj.fdb.database.ref('/user-gift/' + obj.uid);
            palierRef.on('value', function(snapshot) {
                obj.palier = snapshot.child('palier').val();
                obj.giftList = [];
                snapshot.child('gifts').forEach( function(childSnapshot) {
                    obj.giftList.push(childSnapshot.val());
                  return false;
                });
                obj.giftList.sort(function (a, b) {
                  return b.palier - a.palier;
                });

                obj.fdb.database.ref('/gift-step').on('value', function(snapshot) {
                    let data = snapshot.val();
                    obj.nextStep = [data.nbRdv[obj.palier], data.nbComment[obj.palier], data.value[obj.palier]];
                    obj.widthBar = Math.round((obj.nbRdv + obj.nbComment) / (obj.nextStep[0] + obj.nextStep[1]) * 100);
                });

            });


            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });

    console.log('ionViewDidLoad GiftPage');
  }

  unlockGift() {
      this.fdb.database.ref('/user-gift/' + this.uid+'/checkin').set(this.palier);

      let loading = this.loadingCtrl.create({
      content: 'Déblocage du cadeau en cours...'
      });

      loading.present();
      var obj = this;
      // On detecte le resultat de la verification en checkant la bdd
      this.fdb.database.ref('/user-gift/' + this.uid+'/checkin').on('value', function(snapshot) {
          if (snapshot.exists() && !Number.isInteger(snapshot.val()) && snapshot.val() !== null) {
              loading.dismiss();
              if (snapshot.val() == 'success') {
                  let alert = obj.alertCtrl.create({
                      title: 'Déblocage effectué',
                      subTitle: "Vous pouvez dès à présent récupérer votre cadeau et vous faire livrer !",
                      buttons: [{
                          text: 'Parfait !'
                      }]
                  });
                  alert.present();
              }
              else if (snapshot.val() == 'failed') {
                  let alert = obj.alertCtrl.create({
                      title: 'Conditions non remplies',
                      subTitle: "Vous n'avez pas encore complété tous les critères pour débloquer le prochain cadeau",
                      buttons: [{
                          text: 'Ok'
                      }]
                  });
                  alert.present();
              }
              else {
                  let alert = obj.alertCtrl.create({
                      title: 'Erreur lors du déblocage',
                      subTitle: "Une erreur s'est produite, veuillez réessayer ultérieurement",
                      buttons: [{
                          text: 'Ok'
                      }]
                  });
                  alert.present();
              }

          }
      });
  }

}
