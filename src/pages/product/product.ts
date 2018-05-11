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


@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  uid: string;
  statut;
  place;
  idList;
  selected = 0;
  isGift: boolean = false;
  product = [{}];
  qte: number = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fdb: AngularFireDatabase) {
      this.qte = navParams.get('qte') ? navParams.get('qte') : 1;
      this.idList = navParams.get('idList') ? navParams.get('idList') : null;
      this.isGift = navParams.get('isGift') ? navParams.get('isGift') : false;

      for (let i=0; i<this.idList.length; i++)
         this.product[i] = {};
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ProductPage');

      const obj = this;

      for (let i=0; i<this.idList.length; i++) {
          var boutiqueRef = this.fdb.database.ref('/products/'+this.idList[i]);
          boutiqueRef.once('value', function(snapshot) {
             obj.product[i] = snapshot.val();
             console.log( obj.product);
          });
      }

      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              obj.uid = user.uid;

              var adresseRef = obj.fdb.database.ref('/users/'+obj.uid);
              adresseRef.once('value', function(snapshot) {
                 obj.statut = snapshot.child('statut');
              });

          } else {
            // No user is signed in.
            console.log("No user signed");
            obj.navCtrl.setRoot(HelloIonicPage);
          }
        });

  }

  takeGift() {

  }

  buy() {
      //if (this.place) {
          this.navCtrl.push('AddressFormPage', {product: { id: this.idList[this.selected], qte: this.qte }, type: this.isGift ? 'gift' : 'shopProduct', statut : this.statut, giftId: this.isGift ? this.navParams.get('giftId') : null });
      /*}
      else {
          let alertVerification = this.alertCtrl.create({
            title: "Adresse non fournie",
            subTitle: "Vous devez entrer votre adresse dans votre profil pour que nous puissions vous livrer le produit.",
            buttons: ['OK']
          });
          alertVerification.present();
          this.navCtrl.push('SetAddressPage', {update: true});

      }
      */
  }
}
