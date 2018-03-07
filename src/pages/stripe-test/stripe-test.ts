import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

/**
 * Generated class for the StripeTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stripe-test',
  templateUrl: 'stripe-test.html',
})
export class StripeTestPage {
    uid;
  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private stripe: Stripe,
                private fdb: AngularFireDatabase) {
    this.stripe.setPublishableKey('pk_test_GVdri5h8Au1S59E93JEBBbP3');

      var obj = this;


      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;
            obj.addCard();



            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StripeTestPage');

  }

  addCard() {
      let card = {
       number: '4242 4242 4242 4242',
       expMonth: 12,
       expYear: 2020,
       cvc: '220',
       postal_code: '91000'
      };

      var obj = this;
      this.stripe.createCardToken(card)
         .then(token => obj.saveCard(token.id))
         .catch(error => console.error('Stripe ERROR !!' + error));

  }

  saveCard(token) {
      this.fdb.database.ref(`/stripe_customers/${this.uid}/sources`).push({token: token});
  }

  newCharge() {

      var result = firebase.database().ref(`/stripe_customers/${this.uid}/charges`).push({
        source: null,
        amount: 50000,
        destinataire: 'acct_1BwUeeAQVhKMSHYq',
        parrain: 'acct_1BvB5BDlbPZy2VDJ'
      });
      console.log(result);
  }
}
