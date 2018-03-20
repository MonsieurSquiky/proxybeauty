import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductPage } from '../product/product';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the BoutiquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-boutique',
  templateUrl: 'boutique.html',
})
export class BoutiquePage {

  products = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoutiquePage');
    const obj = this;

    var boutiqueRef = this.fdb.database.ref('/products');
    boutiqueRef.once('value', function(snapshot) {
        snapshot.forEach( function(childSnapshot) {
            obj.products.push(childSnapshot.val());


          return false;
        });

    });
  }

  seeProduct(idProduct) {
      console.log(idProduct);
      this.navCtrl.push(ProductPage, { idProduct });
  }

}
