import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductPage } from '../product/product';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the BoutiquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-boutique',
  templateUrl: 'boutique.html',
})
export class BoutiquePage {

  products = [];
  uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoutiquePage');
    const obj = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          obj.uid = user.uid;

          obj.fdb.database.ref('users/'+obj.uid+'/statut').once('value', function (snapshot) {
            obj.loadBoutique( snapshot.exists() ? snapshot.val() : 'client');
          });

          //navCtrl.setRoot(PrestaBoardPage);
        } else {
          // No user is signed in.
          console.log("No user signed");
        }
      });

  }

  async loadBoutique(statut) {
    const obj = this;

    
    console.log(statut);
    var boutiqueRef = this.fdb.database.ref('/products');
    boutiqueRef.once('value', function(snapshot) {
        snapshot.forEach( function(childSnapshot) {
            let product = childSnapshot.val();
            if (product.statut == statut)
              obj.products.push(product);
          return false;
        });

    });
  }

  seeProduct(idProduct) {
      this.navCtrl.push(ProductPage, { idList: [idProduct] });
  }

}
