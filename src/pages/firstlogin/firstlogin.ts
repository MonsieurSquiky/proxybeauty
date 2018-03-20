import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { SetAddressPage } from '../set-address/set-address';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

import $ from "jquery";
import 'intl-tel-input';

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
    birthdate = null;
    uid: string;
    isPresta: boolean = false;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, private fdb: AngularFireDatabase, public navParams: NavParams) {
        this.firstname = navParams.get('firstname') ? navParams.get('firstname') : null;
        this.lastname = navParams.get('lastname') ? navParams.get('lastname') : null;
        this.birthdate = navParams.get('birthdate') ? navParams.get('birthdate').year + '-' + navParams.get('birthdate').month + '-'+ navParams.get('birthdate').day : null;
    }

    ionViewDidLoad() {
        var obj = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;

              var statut = firebase.database().ref('users/' + user.uid + '/statut');
                statut.on('value', function(snapshot) {
                  obj.isPresta = (snapshot.val() == "prestataire") ? true : false;
                });


              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
              obj.navCtrl.setRoot(HelloIonicPage);
            }
          });
    }

    goNextPage() {
        if (this.navParams.get('update'))
            this.navCtrl.pop();
        else
            this.navCtrl.push(SetAddressPage);
    }

    save() {

        if (this.invariant()) {
            var ref = this.fdb.database.ref("/users/"+ this.uid);
            var b = (this.birthdate) ? this.birthdate.split('-') : null;
            const obj = this;
            //console.debug(b ? { year: b[0], month: b[1], day: b[2] } : null);

            ref.update({
              firstname: this.firstname,
              lastname: this.lastname,
              birthdate: b ? { year: b[0], month: b[1], day: b[2] } : null,
              setupStep: this.navParams.get('update') ? 'complete' : 2
            }).then(function() {
              obj.goNextPage();
            }).catch(function(error) {
              // An error happened.
              //console.debug(error);
              let alertVerification = obj.alertCtrl.create({
                title: "Echec",
                subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
                buttons: ['OK']
              });
              alertVerification.present();
            });
        }
    }

    invariant() {
        if (this.lastname == null || this.lastname == "" || this.firstname == null || this.firstname == "") {
            let alert = this.alertCtrl.create({
              title: "Nom ou prénom invalide",
              subTitle: "Veuillez remplir les champs nom et prénom correctement.",
              buttons: ['OK']
            });
            alert.present();
            return false;
        }
        if (this.isPresta && (!this.birthdate || this.birthdate == null || this.birthdate == "")) {
            let alertDob = this.alertCtrl.create({
              title: "Date de naissance non fournie",
              subTitle: "N'oubliez pas de rentrez votre date de naissance et de la confirmer.",
              buttons: ['OK']
            });
            alertDob.present();
            return false;
        }
        /*
        else {
            let regExp = /^[0-9]{10}$/;

            if (!regExp.test(this.phoneNumber)) {
                let alertphone = this.alertCtrl.create({
                  title: "Numéro de téléphone invalide",
                  subTitle: "Rentrez un numéro de téléphone correct de cette forme : 0636303630.",
                  buttons: ['OK']
                });
                alertphone.present();
                return false;
            }
            return true;
        }
        */
        return true;
    }


}
