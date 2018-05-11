import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the AddressFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address-form',
  templateUrl: 'address-form.html',
})
export class AddressFormPage {
  uid;
  street;
  city;
  zipCode;
  country;
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
            obj.fdb.database.ref('users/'+user.uid+'/address/details').on('value', function(snapshot) {
                if (snapshot.exists()) {
                    let data = snapshot.val();
                    obj.street = data.subThoroughfare + ' ' + data.thoroughfare;
                    obj.city = data.locality;
                    obj.zipCode = data.postalCode;
                    obj.country = data.countryName;
                }
            });
        }
    });
  }

  buy() {
      let place = { street: this.street, city: this.city, zipCode: this.zipCode, country: this.country };
      var obj = this;

      if (this.type == 'gift') {
          // Call functions
          this.fdb.database.ref('/user-gift/'+ this.uid+'/retrieving').set({state:'processing', product: this.product, place, giftKey: this.navParams.get('giftId')});
          let loading = this.loadingCtrl.create({
          content: 'Commande du cadeau en cours de vérification...'
          });

          loading.present();

          this.fdb.database.ref('/user-gift/'+this.uid+'/gifts/'+this.navParams.get('giftId')).on('value', function(snapshot) {
              if (snapshot.val().state == 'retrieved') {
                  loading.dismiss();
                  let alert = obj.alertCtrl.create({
                    title: 'Cadeau commandé !',
                    subTitle: 'Félicitation, votre cadeau sera expédié sous peu !',
                    buttons: [{
                        text: 'Parfait !'
                      }]
                  });
                  alert.present();
                  obj.navCtrl.setRoot('GiftPage');
              }
          });

          this.fdb.database.ref('/user-gift/'+this.uid+'/retrieving').on('value', function(snapshot) {
              if (snapshot.val().state == 'notAvailable') {
                  loading.dismiss();
                  let alert = obj.alertCtrl.create({
                    title: 'Ce cadeau a déjà été commandé',
                    subTitle: 'Vous avez déjà demandé à recevoir ce cadeau.',
                    buttons: [{
                        text: 'OK'
                      }]
                  });
                  alert.present();
                  obj.navCtrl.setRoot('GiftPage');
              }
          });
      }
      else
        this.navCtrl.push('PaybookingPage', { product: this.product, type: this.type, statut: this.statut, place});

  }

}
