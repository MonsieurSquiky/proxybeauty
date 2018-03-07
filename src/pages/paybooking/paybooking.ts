import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { AngularFireDatabase } from 'angularfire2/database';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { PrestaRdvPage } from '../presta-rdv/presta-rdv';
import { AmbassadorPage } from '../ambassador/ambassador';

import firebase from 'firebase';

import * as $ from 'jquery'


/**
 * Generated class for the PaybookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paybooking',
  templateUrl: 'paybooking.html',
})
export class PaybookingPage {

  uid;
  cardHolder;
  cardNumber;
  cardMonth;
  cardYear;
  cardCVC;
  cardZip;
  product;
  destinataire;
  rdvTimestamp
  prix;
  type;
  loading;

  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private stripe: Stripe,
                private fdb: AngularFireDatabase,
                public loadingCtrl:LoadingController,
                public alertCtrl:AlertController) {

      this.stripe.setPublishableKey('pk_test_GVdri5h8Au1S59E93JEBBbP3');

      this.product = navParams.get('product');
      this.rdvTimestamp = navParams.get('timestamp');
      this.destinataire = navParams.get('destinataire');
      this.prix = navParams.get('prix');
      this.type = navParams.get('type');



        var obj = this;
        let loading1 = this.loadingCtrl.create({
        content: 'Preparation...'
        });

        loading1.present();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
              loading1.dismiss();
              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
              loading1.dismiss();
              navCtrl.setRoot(HelloIonicPage);
            }
          });
    }

    addCard() {
        let card = {
         number: this.cardNumber,
         expMonth: this.cardMonth,
         expYear: this.cardYear,
         cvc: this.cardCVC,
         postal_code: this.cardZip
        };

        this.loading = this.loadingCtrl.create({
        content: 'Paiement en cours de vérification...'
        });

        this.loading.present();

        var obj = this;
        this.stripe.createCardToken(card)
           .then(token => {
               if (obj.type == 'abonnement')
                 obj.newSubmit(token.id);
               else
                obj.newCharge(token.id);
           }).catch(error => {
               obj.loading.dismiss();
               let alert = obj.alertCtrl.create({
                 title: 'Erreur dans les informations fournies',
                 subTitle: 'Les informations que vous avez fournies sont incorrectes : '+ error +'. Vérifiez les puis réessayer.',
                 buttons: [{
                     text: 'OK'
                   }]
               });
               alert.present();
           });

    }

    saveCard(token) {
        this.fdb.database.ref(`/stripe_customers/${this.uid}/sources`).push({token: token});
    }

    newSubmit(sourceToken) {
        var obj=this;
        let newKey = firebase.database().ref(`/stripe_customers/${this.uid}/abonnement`).push().key;

        this.fdb.database.ref(`/stripe_customers/${this.uid}/abonnement/${newKey}`).set({
          source: sourceToken,
          amount: this.prix,
          idClient: this.uid
        });


        // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
        this.fdb.database.ref(`/stripe_customers/${this.uid}/submitResponse/${newKey}/resultCharge`).on('value', function(snapshot) {
            if (snapshot.val().status == "succeeded") {
                // On passe le client en ambassadeur dans la bdd

                // Write the new rdv's data simultaneously in the rdv list and the users datas.
                let updates = {};
                updates['/parrains/' + obj.uid+'/ambassador'] = true;
                updates['/users/' + obj.uid + '/ambassador'] = true;

                obj.fdb.database.ref().update(updates)
                    .then(() => {
                        obj.loading.dismiss();
                        let alert = obj.alertCtrl.create({
                          title: 'Paiement effectué avec succès',
                          subTitle: "Le paiement a bien été pris en compte et vous avez désormais le statut d'ambassadeur",
                          buttons: [{
                              text: 'Parfait !',
                              handler: () => {
                                obj.navCtrl.setRoot(AmbassadorPage);
                              }
                            }]
                        });
                        alert.present();
                    }).catch((error) => {
                        // il faut refaire la sauvegarde en bdd
                        console.log(error);
                    });


            }
        });
    }

    async newCharge(sourceToken) {
        var obj = this;
        var destinataireAccount;
        var parrain_prestataireAccount = false;
        var parrain_clientAccount = false;
        var parrain_prestataire;
        var parrain_client;

        await this.fdb.database.ref('/stripe_sellers/' + this.destinataire + '/token/id').once('value', function(snapshot) {
            destinataireAccount = snapshot.val();
        });

        await this.fdb.database.ref('/user-parrain/' + this.destinataire + '/parrainId').once('value', function(snapshot) {
            parrain_prestataire = (snapshot.val()) ? snapshot.val() : false;
        });

        await this.fdb.database.ref('/user-parrain/' + obj.uid + '/parrainId').once('value', function(snapshot) {
            parrain_client = (snapshot.val()) ? snapshot.val() : false;
        });
        console.debug(destinataireAccount);
        console.debug(parrain_prestataire);
        console.debug(parrain_client);

        if (parrain_prestataire) {
            await firebase.database().ref('/stripe_sellers/' + parrain_prestataire + '/token/id').once('value', function(snapshot) {
                parrain_prestataireAccount = snapshot.val();
            });
        }

        if (parrain_client) {
            await firebase.database().ref('/stripe_sellers/' + parrain_client + '/token/id').once('value', function(snapshot) {
                parrain_clientAccount = snapshot.val();
            });
        }

        let newKey = firebase.database().ref(`/stripe_customers/${this.uid}/charges`).push().key;

        this.fdb.database.ref(`/stripe_customers/${this.uid}/charges/${newKey}`).set({
          source: sourceToken,
          amount: obj.prix,
          ids: {prestataire: this.destinataire, parrain_client, parrain_prestataire },
          destinataire: destinataireAccount,
          parrain_prestataire: parrain_prestataireAccount,
          parrain_client: parrain_clientAccount
        });

        console.debug(parrain_prestataireAccount);
        console.debug(parrain_clientAccount);

        // On dwtecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
        this.fdb.database.ref(`/stripe_customers/${this.uid}/response/${newKey}/resultCharge`).on('value', function(snapshot) {
            if (snapshot.val().status == "succeeded") {
                // Creation du rdv dans la base de donnee (en dur, chez le prestataire et chez le client)


                let rdvDatas = {
                    client: obj.uid,
                    prestataire: obj.destinataire,
                    prix: obj.prix,
                    category: obj.product.category,
                    tags: obj.product.tags,
                    duree: obj.product.duree,
                    place: obj.product.place,
                    timestamp: obj.rdvTimestamp
                }

                let newRDVKey = firebase.database().ref().child('rdv').push().key;

                // Write the new rdv's data simultaneously in the rdv list and the users datas.
                let updates = {};
                updates['/rdv/' + newRDVKey] = rdvDatas;
                updates['/user-rdv/' + obj.uid + '/' + newRDVKey] = rdvDatas;
                updates['/user-rdv/' + obj.destinataire + '/' + newRDVKey] = rdvDatas;

                obj.fdb.database.ref().update(updates)
                    .then(() => {
                        obj.loading.dismiss();
                        let alert = obj.alertCtrl.create({
                          title: 'Paiement effectué avec succès',
                          subTitle: 'Le paiement a bien été pris en compte et votre rendez-vous est pris',
                          buttons: [{
                              text: 'Parfait !',
                              handler: () => {
                                obj.navCtrl.setRoot(PrestaRdvPage);
                              }
                            }]
                        });
                        alert.present();
                    }).catch((error) => {
                        // il faut refaire la sauvegarde en bdd
                        console.log(error);
                    });


            }
        });
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PaybookingPage');
  }

}
