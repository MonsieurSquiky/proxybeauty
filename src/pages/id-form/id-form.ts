import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the IdFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-id-form',
  templateUrl: 'id-form.html',
})
export class IdFormPage {
    uid;
    firstname;
    lastname;
    email;
    type;
    product;
    statut;

    constructor(  public navCtrl: NavController,
                  public navParams: NavParams,
                  private fdb: AngularFireDatabase,
                  public loadingCtrl: LoadingController,
                  public alertCtrl: AlertController) {
        this.type = navParams.get('type') ? navParams.get('type') : null;
        this.product = navParams.get('product') ? navParams.get('product') : null;
        this.statut = navParams.get('statut') ? navParams.get('statut') : null;
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad AddressFormPage');
      var obj = this;
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              obj.uid = user.uid;
              obj.fdb.database.ref('users/'+user.uid).on('value', function(snapshot) {
                  if (snapshot.exists()) {
                      let data = snapshot.val();
                      obj.firstname = data.firstname ? data.firstname : false;
                      obj.lastname = data.lastname ? data.lastname : false;
                      obj.email = data.email ? data.email : false;
                  }
              });
          }
      });
    }

    next() {
        if (this.invariant())
            this.navCtrl.push('AddressFormPage', {product: this.product, type: this.type, statut : this.statut, giftId: this.navParams.get('giftId'), user_infos: {firstname: this.firstname, lastname: this.lastname, email: this.email} });

    }

    invariant() {
        if (this.lastname == null || this.lastname == "" || this.firstname == null || this.firstname == "" ) {
            let alert = this.alertCtrl.create({
              title: "Nom ou prénom invalide",
              subTitle: "Veuillez remplir les champs nom et prénom correctement.",
              buttons: ['OK']
            });
            alert.present();
            return false;
        }
        if (this.email == null || this.email == "" ) {
            let alertDob = this.alertCtrl.create({
              title: "Email non fourni",
              subTitle: "N'oubliez pas de rentrez votre email afin de bien recevoir une confirmation et une preuve de votre commande.",
              buttons: ['OK']
            });
            alertDob.present();
            return false;
        }

        return true;
    }

}
