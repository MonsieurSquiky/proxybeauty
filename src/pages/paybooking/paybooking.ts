import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { AngularFireDatabase } from 'angularfire2/database';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { PrestaRdvPage } from '../presta-rdv/presta-rdv';
import { AmbassadorPage } from '../ambassador/ambassador';
import { ReqHttpProvider } from '../../providers/req-http/req-http';

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
  place;
  statut;
  loading;
  user_infos;

  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private stripe: Stripe,
                private fdb: AngularFireDatabase,
                public loadingCtrl:LoadingController,
                public alertCtrl:AlertController,
                public reqHttp: ReqHttpProvider) {

      this.stripe.setPublishableKey('pk_live_43QYPKhdyXb32bFFeR14Gw59');

      this.product = navParams.get('product');
      this.rdvTimestamp = navParams.get('timestamp');
      this.destinataire = navParams.get('destinataire');
      this.prix = navParams.get('prix');
      this.type = navParams.get('type');
      this.place = navParams.get('place');
      this.statut = navParams.get('statut');
      this.user_infos = navParams.get('user_infos') ? navParams.get('user_infos') : false;


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
              obj.uid = false;
              loading1.dismiss();
              //navCtrl.setRoot(HelloIonicPage);
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
                 obj.saveCard(token.id);
               else if (obj.type == 'shopProduct')
                 obj.buyProduct(token.id);
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
        var obj = this;
        let sourceKey = firebase.database().ref(`/stripe_customers/${this.uid}/sources`).push().key;

        this.fdb.database.ref(`/stripe_customers/${this.uid}/sources/${sourceKey}`).set({token: token});

        this.fdb.database.ref(`/stripe_customers/${this.uid}/sources/${sourceKey}/result`).on('value', function(snapshot) {
            if (snapshot.exists())
                obj.newSubmit(token);
        });

        this.fdb.database.ref(`/stripe_customers/${this.uid}/sources/${sourceKey}/error`).on('value', function(snapshot) {
            if (snapshot.exists()) {
                obj.loading.dismiss();
                let alert = obj.alertCtrl.create({
                  title: 'Erreur lors du paiement',
                  subTitle: "Le paiement a échoué, vérifiez vos coordonnées bancaires ou changez de carte",
                  buttons: [{
                      text: 'Ok',
                      handler: () => {
                        //obj.navCtrl.setRoot(AmbassadorPage);
                      }
                    }]
                });
                alert.present();
            }
        });
    }

    async buyProduct(sourceToken) {
        var obj=this;
        var parrainId = false;
        var parrainAccount = null;
        console.log('In');

        if (this.uid) {
            await this.fdb.database.ref('/user-parrain/' + obj.uid + '/parrainId').once('value', function(snapshot) {
                parrainId = (snapshot.val()) ? snapshot.val() : false;
            }).catch( (error) => { console.log('Parrain id ' + error) });

            if (parrainId) {
                await firebase.database().ref('/stripe_sellers/' + parrainId + '/token/id').once('value', function(snapshot) {
                    parrainAccount = snapshot.val();
                }).catch( (error) => { console.log('Parrain account ' + error) });
            }
            console.log('Parrain correct');
            let newKey = firebase.database().ref(`/stripe_customers/${this.uid}/shopping`).push().key;
            console.log('Key correct' + newKey);
            this.fdb.database.ref(`/stripe_customers/${this.uid}/shopping/${newKey}`).set({
              source: sourceToken,
              idProduct: this.product.id,
              qte: this.product.qte,
              place: this.place,
              parrainId : parrainId,
              parrainAccount : parrainAccount,
              user_infos: this.user_infos
              }).catch( (error) => { console.log('Fdb shopping ' + error) });

                // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
                this.fdb.database.ref(`/stripe_customers/${this.uid}/shopResponse/${newKey}/resultCharge`).on('value', function(snapshot) {
                    if (snapshot.exists() && snapshot.val().status == "succeeded") {
                        obj.loading.dismiss();
                        let alert = obj.alertCtrl.create({
                          title: 'Paiement effectué avec succès',
                          subTitle: "Le paiement a bien été pris en compte et votre commande est enregistrée",
                          buttons: [{
                              text: 'Parfait !',
                              handler: () => {
                                obj.navCtrl.pop();
                                obj.navCtrl.pop();
                                obj.navCtrl.pop();
                              }
                            }]
                        });
                        alert.present();
                    }
                });

            this.fdb.database.ref(`/stripe_customers/${this.uid}/shopResponse/${newKey}/errorCharge`).on('value', function(snapshot) {
                if (snapshot.exists()) {
                    obj.loading.dismiss();
                    let alert = obj.alertCtrl.create({
                      title: 'Erreur lors du paiement',
                      subTitle: "Le paiement a échoué, vérifiez vos coordonnées bancaires ou changez de carte",
                      buttons: [{
                          text: 'Ok',
                          handler: () => {
                            //obj.navCtrl.setRoot(AmbassadorPage);
                          }
                        }]
                    });
                    alert.present();
                }
            });
        }
        else {
            let body = {source: sourceToken, idProduct: this.product.id, qte: this.product.qte, place: this.place, user_infos: this.user_infos };

            let reqLoader = this.loadingCtrl.create({
            content: 'Opération en cours de traitement...'
            });

            reqLoader.present();

            this.reqHttp.callFirebaseShop('shopOrder', body, [reqLoader, this.loading], this);
        }
    }

    newSubmit(sourceToken) {
        var obj=this;
        let newKey = firebase.database().ref(`/stripe_customers/${this.uid}/abonnement`).push().key;

        this.fdb.database.ref(`/stripe_customers/${this.uid}/abonnement/${newKey}`).set({
          plan: 'ambassador'
        });


        // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
        this.fdb.database.ref(`/stripe_customers/${this.uid}/submitResponse/${newKey}/resultSubscription`).on('value', function(snapshot) {
            if (snapshot.exists() && snapshot.val().status == "active") {
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
            }
        });

        // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
        this.fdb.database.ref(`/stripe_customers/${this.uid}/submitResponse/${newKey}/errorSubscription`).on('value', function(snapshot) {
            if (snapshot.exists()) {
                obj.loading.dismiss();
                let alert = obj.alertCtrl.create({
                  title: 'Erreur lors du paiement',
                  subTitle: "Le paiement a échoué, vérifiez vos coordonnées bancaires ou changez de carte",
                  buttons: [{
                      text: 'Ok',
                      handler: () => {
                        //obj.navCtrl.setRoot(AmbassadorPage);
                      }
                    }]
                });
                alert.present();
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

        let rdvDatas = {
            client: obj.uid,
            prestataire: obj.destinataire,
            prix: obj.prix,
            category: obj.product.category,
            tags: obj.product.tags,
            duree: obj.product.duree,
            place: obj.product.place,
            timestamp: obj.rdvTimestamp,
            charge: newKey
        }

        this.fdb.database.ref(`/stripe_customers/${this.uid}/charges/${newKey}`).set({
          source: sourceToken,
          amount: obj.prix,
          ids: {prestataire: this.destinataire, parrain_client, parrain_prestataire },
          destinataire: destinataireAccount,
          parrain_prestataire: parrain_prestataireAccount,
          parrain_client: parrain_clientAccount,
          rdvDatas
        });

        // On dwtecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
        this.fdb.database.ref(`/stripe_customers/${this.uid}/response/${newKey}/resultCharge`).on('value', function(snapshot) {
            if (snapshot.val().status == "succeeded") {

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

            }
        });

        this.fdb.database.ref(`/stripe_customers/${this.uid}/response/${newKey}/errorCharge`).on('value', function(snapshot) {
            if (snapshot.exists()) {
                obj.loading.dismiss();
                let alert = obj.alertCtrl.create({
                  title: 'Erreur lors du paiement',
                  subTitle: "Le paiement a échoué, vérifiez vos coordonnées bancaires ou changez de carte",
                  buttons: [{
                      text: 'Ok',
                      handler: () => {
                        //obj.navCtrl.setRoot(AmbassadorPage);
                      }
                    }]
                });
                alert.present();
            }
        });
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PaybookingPage');
  }

}
