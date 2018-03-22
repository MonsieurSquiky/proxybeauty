import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FilterPage } from '../filter/filter';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the PrestaListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-presta-list',
  templateUrl: 'presta-list.html',

})
export class PrestaListPage {
    uid;
    offerCategories = ['Ongles', 'Coiffure', 'Massage', 'Epilation', 'Visage'];
    offersList = [];
    offersKey = [];
    offersLoad: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase, public alertCtrl: AlertController,
       public actionSheetCtrl: ActionSheetController) {
      var obj = this;
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;
            console.log('In');
            var offersRef = fdb.database.ref('/user-offers/' + obj.uid);
            offersRef.on('value', function(snapshot) {
                snapshot.forEach( function(childSnapshot) {
                    if (obj.offersKey.indexOf(childSnapshot.key) == -1) {
                      obj.offersKey.push(childSnapshot.key);
                      obj.offersList.push(childSnapshot.val());
                      obj.offersLoad = true;
                    }

                  return false;
                });

                if (obj.offersList.length == 0) {
                    let alertVerification = obj.alertCtrl.create({
                      title: "Ajoutez vos prestatations",
                      subTitle: "Touchez le bouton en bas à droite pour ajouter les prestations que vous pratiquez.",
                      buttons: ['OK']
                    });
                    alertVerification.present();

                }

            });
            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrestaListPage');
  }

  addOffer() {
      let actionSheet = this.actionSheetCtrl.create({
        title: "Quel type d'offre voulez-vous créer ? ",
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: () => {
              //console.log('Cancel clicked');
            }
          }
        ]
      });

      for (let category of this.offerCategories ) {

          actionSheet.addButton({text: category,
                                  handler: () => {

                                    this.navCtrl.push(FilterPage, {category: category});
                                }});
      }

      actionSheet.present();

  }
  deleteOffer(offerKey) {
      var obj = this;
      let confirm = this.alertCtrl.create({
      title: 'Supprimer cette offre ?',
      message: 'Etes-vous sûr de vouloir supprimer cette offre ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirmer',
          handler: () => {
              console.log(obj.offersList);
              console.log(obj.offersKey);

              var updates = {};
              updates['/offers/' + offerKey] = null;
              updates['/user-offers/' + this.uid + '/' + offerKey] = null;

              obj.fdb.database.ref().update(updates);

              obj.offersList.splice(this.offersKey.indexOf(offerKey), 1);
              obj.offersKey.splice(this.offersKey.indexOf(offerKey), 1);
              console.log(obj.offersList);
              console.log(obj.offersKey);
          }
        }
      ]
    });
    confirm.present();
  }

  changeOffer(category, offerKey) {
      this.navCtrl.push(FilterPage, { category: category, offerId: offerKey});
  }

}
