import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { ConditionsPage } from '../conditions/conditions';

/**
 * Generated class for the SetParrainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-parrain',
  templateUrl: 'set-parrain.html',
})
export class SetParrainPage {
    uid;
    parrainId;

    constructor(  public loadingCtrl: LoadingController,
                  public navCtrl: NavController,
                  public navParams: NavParams,
                  public alertCtrl: AlertController,
                  private fdb: AngularFireDatabase) {

          var obj =this;
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // User is signed in.
                obj.uid = user.uid;
                console.log(user.uid);
              } else {
                // No user is signed in.
                console.log("No user signed");
                navCtrl.setRoot(HelloIonicPage);
              }
            });
    }

    saveParrain() {
        var obj = this;

        if (this.parrainId != "" || this.parrainId !== null) {
            this.fdb.database.ref('/users/'+this.parrainId).on('value', function(snapshot) {
                if (snapshot.val()) {

                    let updates = {};
                    updates['/user-parrain/'+obj.uid] = {parrainId: obj.parrainId};
                    updates['/users/' + obj.uid + '/setupStep'] = 5;

                    obj.fdb.database.ref().update(updates).
                        then( result => {
                            obj.goNext();
                        }).catch(error => {
                            let alertVerification = obj.alertCtrl.create({
                              title: "Echec",
                              subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
                              buttons: ['OK']
                            });
                            alertVerification.present();
                        });
                }
                else {
                    let alertVerification = obj.alertCtrl.create({
                      title: "Code parrain inexistant",
                      subTitle: "Le code parrain que vous avez rentré est incorrect, veuillez le corriger puis réessayer.",
                      buttons: ['OK']
                    });
                    alertVerification.present();
                }
            });
        }
        else {
            let alertVerification = obj.alertCtrl.create({
              title: "Code parrain non indiqué",
              subTitle: "Vous devez remplir le champ code parrain.",
              buttons: ['OK']
            });
            alertVerification.present();
        }
    }

    goNext() {
        this.navCtrl.push(ConditionsPage);
    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad SetParrainPage');
    }

}
