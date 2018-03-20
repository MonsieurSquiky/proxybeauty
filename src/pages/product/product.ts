import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { SetAddressPage } from '../set-address/set-address';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  uid: string;
  statut;
  place;
  id: number;
  product = {};
  qte: number = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fdb: AngularFireDatabase) {
      this.id = navParams.get('idProduct');
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ProductPage');
      const obj = this;

      var boutiqueRef = this.fdb.database.ref('/products/'+this.id);
      boutiqueRef.once('value', function(snapshot) {
         obj.product = snapshot.val();
      });
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              obj.uid = user.uid;

              var adresseRef = obj.fdb.database.ref('/users/'+obj.uid);
              adresseRef.once('value', function(snapshot) {
                 obj.place = (snapshot.hasChild('address/place')) ? snapshot.child('/address/place').val() : null;
                 obj.statut = snapshot.child('statut');
              });

          } else {
            // No user is signed in.
            console.log("No user signed");
            obj.navCtrl.setRoot(HelloIonicPage);
          }
        });

  }

  buy() {
      if (this.place) {
          this.navCtrl.push('PaybookingPage', {product: { id: this.id, qte: this.qte }, type: 'shopProduct', statut : this.statut, place: this.place });
      }
      else {
          let alertVerification = this.alertCtrl.create({
            title: "Adresse non fournie",
            subTitle: "Vous devez entrer votre adresse dans votre profil pour que nous puissions vous livrer le produit.",
            buttons: ['OK']
          });
          alertVerification.present();
          this.navCtrl.push('SetAddressPage', {update: true});

      }
  }
}
