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
  reduction;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fdb: AngularFireDatabase) {
      this.qte = navParams.get('qte') ? navParams.get('qte') : 1;
      this.idList = navParams.get('idList') ? navParams.get('idList') : null;
      this.isGift = navParams.get('isGift') ? navParams.get('isGift') : false;

      this.reduction = false;

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
              obj.checkReduction();

          } else {
            // No user is signed in.
            console.log("No user signed");
            obj.statut = 'client';
          }
        });

  }

  takeGift() {

  }

  async checkReduction () {
      var obj = this;

      /*
      var shopRef = this.fdb.database.ref(`/stripe_customers/${this.uid}/shopResponse`);
      shopRef.once('value', async function(snapshot) {
          let nbPurchase = 0;
          let parrainId = false;

          try {
              let snapParrain = await obj.fdb.database.ref('/user-parrain/' + obj.uid + '/parrainId').once('value');
              parrainId = (snapParrain.val()) ? snapParrain.val() : false;
          }
          catch (error) {
              console.log('Parrain id ' + error);
          }

          console.log(parrainId);

          snapshot.forEach( function(childSnapshot) {
              nbPurchase += 1;
              console.log(nbPurchase);
            return false;
          });
          console.log(nbPurchase);


          obj.reduction = (nbPurchase == 0 && parrainId) ? 0.8 : false;
          */

          // Si le client a un parrain, il beneficie de 20% de reducs sur tous ses achats
          let snapParrain = await obj.fdb.database.ref('/user-parrain/' + obj.uid + '/parrainId').once('value');
          let parrainId = (snapParrain.val()) ? snapParrain.val() : false;

          obj.reduction = (parrainId) ? 0.8 : false;
  }

  buy() {
      //if (this.place) {
          this.navCtrl.push('IdFormPage', {product: { id: this.idList[this.selected], qte: this.qte }, type: this.isGift ? 'gift' : 'shopProduct', statut : this.statut, giftId: this.isGift ? this.navParams.get('giftId') : null });
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
