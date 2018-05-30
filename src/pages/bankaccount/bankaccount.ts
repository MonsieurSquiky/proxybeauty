import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import IBAN from 'iban';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the BankaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-bankaccount',
  templateUrl: 'bankaccount.html',
})
export class BankaccountPage {
  uid;
  stripe;
  iban;
  ibanRaw;
  noAccount = true;
  accountName;
  accountBank;
  accountList = [];
  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private fdb: AngularFireDatabase,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController) {

      this.stripe = Stripe('pk_test_aHC0D842ZOVEaBZ2t7Z2fBQp');
  }

  setupStripe(){
      // Create an instance of Elements.
      const obj = this;
      var elements = this.stripe.elements();

      // Custom styling can be passed to options when creating an Element.
      // (Note that this demo uses a wider set of styles than the guide below.)
      var style = {
        base: {
          color: '#32325d',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          },
          ':-webkit-autofill': {
            color: '#32325d',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
          ':-webkit-autofill': {
            color: '#fa755a',
          },
        }
      };

      // Create an instance of the iban Element.
      var iban = elements.create('iban', {
        style: style,
        supportedCountries: ['SEPA'],
      });

      // Add an instance of the iban Element into the `iban-element` <div>.
      iban.mount('#iban-element');

      var errorMessage = document.getElementById('error-message');
      var bankName = document.getElementById('bank-name');

      iban.on('change', function(event) {
        // Handle real-time validation errors from the iban Element.
        if (event.error) {
          errorMessage.textContent = event.error.message;
          errorMessage.classList.add('visible');
        } else {
          errorMessage.classList.remove('visible');
        }

        // Display bank name corresponding to IBAN, if available.
        if (event.bankName) {
          bankName.textContent = event.bankName;
          bankName.classList.add('visible');
        } else {
          bankName.classList.remove('visible');
        }
      });

      // Handle form submission.
      var form = document.getElementById('payment-form');
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        //showLoading();

        var sourceData = {
            currency: 'eur',
            account_holder_name:  obj.accountName,
            account_holder_type: 'individual'
        };

        // Call `stripe.createSource` with the iban Element and additional options.
        obj.stripe.createToken(iban, sourceData).then(function(result) {
          if (result.error) {
            // Inform the customer that there was an error.
            errorMessage.textContent = result.error.message;
            errorMessage.classList.add('visible');
            //stopLoading();
          } else {
            // Send the Source to your server to create a charge.
            errorMessage.classList.remove('visible');

            obj.accountList.push(result.token);

            obj.fdb.database.ref('user-bankaccount/'+obj.uid).set({ banktoken: result.token.id, name: obj.accountName, bank_name: result.token.bank_account.bank_name });
            console.log(result);
            let loading = obj.loadingCtrl.create({
            content: 'Vérification des coordonnées...'
            });

            loading.present();

            // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
            obj.fdb.database.ref('user-bankaccount/'+obj.uid+'/accountList').on('value', function(snapshot) {
                if (snapshot.exists()) {
                    loading.dismiss();
                    let alert = obj.alertCtrl.create({
                      title: 'Compte associé avec succès',
                      subTitle: "Votre compte est bien associé et vos gains vous seront virés automatiquement dessus.",
                      buttons: [{
                          text: 'Parfait !'
                        }]
                    });
                    alert.present();
                }
            });

            // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
            obj.fdb.database.ref('user-bankaccount/'+obj.uid+'/error').on('value', function(snapshot) {
                if (snapshot.exists()) {
                    loading.dismiss();
                    let alert = obj.alertCtrl.create({
                      title: 'Informations non valides',
                      subTitle: "Veuillez corrigez vos informations et recommencer. Si votre problème persiste, contactez le support.",
                      buttons: [{
                          text: 'OK'
                        }]
                    });
                    alert.present();
                }
            });
            //stripeSourceHandler(result.source);
          }
        });
      });
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad BankaccountPage');
    this.setupStripe();
    const obj = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            obj.uid = user.uid;
            obj.fdb.database.ref('user-bankaccount/'+user.uid+'/accountList').on('value', function(snapshot) {
                if (snapshot.exists()) {
                    obj.accountList = snapshot.val();
                    obj.accountName = snapshot.val().account_holder_name;
                    obj.accountBank = snapshot.val().bank_name;
                    obj.noAccount = false;
                }
                /*
                if (obj.accountList.length == 0) {
                    let alertVerification = obj.alertCtrl.create({
                      title: "Ajoutez un compte",
                      subTitle: "Touchez le bouton en bas à droite pour ajouter les compte que vous souhaitez créditer.",
                      buttons: ['OK']
                    });
                    alertVerification.present();

                }
                */
            });
        }
    });
  }

  saveIban() {
      console.log('Saving');
      const obj = this;
      let rawData = {iban : this.ibanRaw, name: this.accountName};
      if (this.invariant(rawData)) {
          this.fdb.database.ref('user-bankaccount/'+this.uid).set({ rawData, name: this.accountName });

          let loading = this.loadingCtrl.create({
          content: 'Vérification des coordonnées...'
          });

          loading.present();

          // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
          this.fdb.database.ref('user-bankaccount/'+this.uid+'/accountList').on('value', function(snapshot) {
              if (snapshot.exists()) {
                  loading.dismiss();
                  let alert = obj.alertCtrl.create({
                    title: 'Compte associé avec succès',
                    subTitle: "Votre compte est bien associé et vos gains vous seront virés automatiquement dessus.",
                    buttons: [{
                        text: 'Parfait !'
                      }]
                  });
                  alert.present();
              }
          });

          // On detecte le resultat du paiement en regardant si la reponse a ete ecrite sur la bdd
          this.fdb.database.ref('user-bankaccount/'+this.uid+'/error').on('value', function(snapshot) {
              if (snapshot.exists()) {
                  loading.dismiss();
                  let alert = obj.alertCtrl.create({
                    title: 'Informations non valides',
                    subTitle: "Veuillez corrigez vos informations et recommencer. Si votre problème persiste, contactez le support.",
                    buttons: [{
                        text: 'OK'
                      }]
                  });
                  alert.present();
              }
          });
      }
  }



  invariant(data) {
      if (data.name == null || data.name == "" || data.iban == null || data.iban == "" ) {
          let alert = this.alertCtrl.create({
            title: "Champs incomplets",
            subTitle: "Veuillez remplir tous les champs.",
            buttons: ['OK']
          });
          alert.present();
          return false;
      }


        return true;
      /*
        if (data.iban.length !=23) {
            let alert = this.alertCtrl.create({
              title: "IBAN incorrect",
              subTitle: "Un IBAN doit comporter 23 caractères.",
              buttons: ['OK']
            });
            alert.present();
            return false;
        }
        else {

            var moveLast = data.iban.substring(0,2);


            var CheckDigit = data.iban.substring(2, 4);

            var BankCode = data.iban.substring(4, 7);
            var AccountCode = data.iban.substring(7, 23);


            if (CheckAllCaps(data.iban) == false) {
                let alert = this.alertCtrl.create({
                  title: "IBAN invalide",
                  subTitle: "Veuillez vérifier votre IBAN.",
                  buttons: ['OK']
                });
                alert.present();
                return false;
            }
            var CountryCodeString = '';
            let CountryCode = 'FR';
            CountryCodeString = GetCharCode(CountryCode);

            //app.alert(CountryCodeString);

            moveLast = BankCode + AccountCode + CountryCodeString + CheckDigit;

            // moveLast = RemoveLeadingZeros(moveLast);



            //app.alert(strcode);

            var strcode = parseFloat(strcode) % 97;
            //app.alert(strcode);

            if (strcode != "1") {
                let alert = this.alertCtrl.create({
                  title: "IBAN invalide",
                  subTitle: "Veuillez vérifier votre IBAN.",
                  buttons: ['OK']
                });
                alert.present();
                return false;
            }
            return true;
        }
        */

  }
}
