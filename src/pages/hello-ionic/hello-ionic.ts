import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

import { DashboardPage } from '../dashboard/dashboard';
import { PrestaBoardPage } from '../presta-board/presta-board';
import { FirstloginTypePage } from '../firstlogin-type/firstlogin-type';
import { FirstloginPage } from '../firstlogin/firstlogin';
import { SetAddressPage } from '../set-address/set-address';
import { ProfilepicPage } from '../profilepic/profilepic';
import { SetParrainPage } from '../set-parrain/set-parrain';
import { ConditionsPage } from '../conditions/conditions';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook'

import { User } from "../../models/user";


@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
    user = {} as User;
    onWayToDashboard = false;
    uid;

  constructor(  public navCtrl: NavController,
                public alertCtrl: AlertController,
                private afAuth: AngularFireAuth,
                private fdb: AngularFireDatabase,
                public facebook: Facebook,
                private googlePlus: GooglePlus,
                public menu: MenuController) {

      this.menu.enable(false);
  }

  ionViewDidLoad() {
      var obj =this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
              /*
              firebase.auth().currentUser.getIdToken().then(function(token) {
                  console.log(token);
              }); */

              if (user.emailVerified || user.providerData[0].providerId != 'password') {
                  console.debug('Provider HERE !!' + user.providerData[0].providerId);
                  obj.goDashboard();
              }
              else
                console.log('Waiting for email to be verified');
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
        });
  }

  facebookLogin(): Promise<any> {
    const obj = this;
    return this.facebook.login(['email'])
      .then( response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then( success => {
            console.log("Firebase success: " + JSON.stringify(success));
            obj.goDashboard();
          });

      }).catch((error) => { console.log(error) });
  }

  googleLogin(): void {
      const obj = this;
      this.googlePlus.login({
        'webClientId': '1090914691423-0p6mbq3ceg6092353jajc7d998e1cmah.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
              const googleCredential = firebase.auth.GoogleAuthProvider
                  .credential(res.idToken);

              firebase.auth().signInWithCredential(googleCredential)
            .then( response => {
                console.log("Firebase success: " + JSON.stringify(response));
                obj.goDashboard();
            });
      }, err => {
          console.log(JSON.stringify(err));
          console.debug("Error: ", err);
          console.log(err.toString());
      });
    }

  confirmPassword(user: User) {
    let prompt = this.alertCtrl.create({
      title: 'Confirmation de votre mot de passe',
      message: "Veuillez entrer à nouveau votre mot de passe afin de confirmer l'inscription",
      inputs: [
        {
          name: 'password_confirm',
          placeholder: 'Entrez à nouveau votre mot de passe :',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log("Inscription annulée");
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            if (data.password_confirm == user.password) {
                this.register(user);
            }
            else {
                user.password = "";
                let alert = this.alertCtrl.create({
                  title: 'Erreur de mot de passe',
                  subTitle: 'Vous avez entrez 2 mots de passes différents, veuillez recommencer et entrer les mêmes.',
                  buttons: ['OK']
                });
                alert.present();
            }
          }
        }
      ]
    });
    prompt.present();
  }



  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
          if (firebase.auth().currentUser.emailVerified)
            this.goDashboard();
          else {
              var obj = this;
              let alertVerification = obj.alertCtrl.create({
                title: "Compte pas encore validé",
                subTitle: "Un email de vérification vous a été envoyé. Cliquer sur le lien qui y figure pour activer votre compte puis connectez vous.",
                buttons: ['OK']
              });
              alertVerification.present();
          }
      }
    }
    catch (e) {
        console.error(e);
        this.errorLogs(e.code);

    }
  }

  goDashboard () {
      console.log(this.uid);
      var ref = this.fdb.database.ref("/users/"+ this.uid);
      var obj = this;
      if (!this.onWayToDashboard) {

          this.onWayToDashboard = true;
          ref.once("value", function(snapshot) {
              if (snapshot.exists()) {
                  switch (snapshot.val().setupStep) {
                    case 0:
                        obj.navCtrl.setRoot(FirstloginTypePage);
                        break;
                    case 1:
                        obj.navCtrl.setRoot(FirstloginPage);
                        break;
                    case 2:
                        obj.navCtrl.setRoot(SetAddressPage);
                        break;
                    case 3:
                        obj.navCtrl.setRoot(ProfilepicPage);
                        break;
                    case 4:
                        obj.navCtrl.setRoot(SetParrainPage);
                        break;
                    case 5:
                        obj.navCtrl.setRoot(ConditionsPage);
                        break;
                    case 'complete':
                        if (snapshot.val().statut == "client")
                          obj.navCtrl.setRoot(DashboardPage);
                        else
                          obj.navCtrl.setRoot(PrestaBoardPage);
                        break;
                    }
              }
              else {
                  let userReg = firebase.auth().currentUser;
                  let updates = {};

                  updates["/users/"+ userReg.uid+"/uid"] = userReg.uid;
                  updates["/users/"+ userReg.uid+"/email"] = userReg.email;
                  updates["/user-gift/"+ userReg.uid+"/palier"] = 0;
                  //updates["/users/"+ userReg.uid+"/setupStep"] = 0;
                  //updates["/users/"+ userReg.uid+"/ambassador"] = false;

                  obj.fdb.database.ref().update(updates);
                  obj.navCtrl.setRoot(FirstloginTypePage);
              }

            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
            this.onWayToDashboard = false;
        }
  }

  async register(user: User) {
      console.log(user);
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {
          const obj = this;
          firebase.auth().currentUser.sendEmailVerification()
          .then(function() {
            // Verification email sent.
            firebase.auth().signOut();

            let alertVerification = obj.alertCtrl.create({
              title: "Mail de vérification envoyé",
              subTitle: "Un email vient de vous être envoyé. Cliquer sur le lien qui y figure pour activer votre compte puis connectez vous.",
              buttons: ['OK']
            });
            alertVerification.present();
          })
          .catch(function(error) {
            // Error occurred. Inspect error.code.
            let alertVerification = obj.alertCtrl.create({
              title: "Echec",
              subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
              buttons: ['OK']
            });
            alertVerification.present();
          });

      }
    } catch (e) {

      console.error(e);
      this.errorLogs(e.code);
    }
  }

  errorLogs(code) {
      switch (code) {
          case "auth/invalid-email":
              let alertMail = this.alertCtrl.create({
                title: "Erreur dans l'adresse mail ",
                subTitle: "Le format de l'adresse mail fournie n'est pas valide. Veuillez entrer une adresse valide.",
                buttons: ['OK']
              });
              alertMail.present();
          break;
          case "auth/argument-error":
              let alert = this.alertCtrl.create({
                title: "Donnees invalides",
                subTitle: "Veuillez remplir les champs de caracteres valides.",
                buttons: ['OK']
              });
              alert.present();
          break;
          case "auth/user-not-found":
              let alertUser = this.alertCtrl.create({
                title: "Compte inexistant",
                subTitle: "Cette adresse mail n'est associee a aucun compte. Creez en un en appuyant sur le bouton s'inscrire.",
                buttons: ['OK']
              });
              alertUser.present();
          break;
          case "auth/wrong-password":
              let alertPassword = this.alertCtrl.create({
                title: "Mot de passe incorrect",
                subTitle: "Le mot de passe ne correspond pas a l'adresse mail. Rentrez le bon mot de passe.",
                buttons: ['OK']
              });
              alertPassword.present();
              this.user.password = "";
          break;
          case "auth/email-already-in-use":
              let alertExist = this.alertCtrl.create({
                title: "Compte deja cree",
                subTitle: "L'adresse mail fournie est deja utilisee. Connectez vous dessus.",
                buttons: ['OK']
              });
              alertExist.present();
          break;
          case "auth/weak-password":
              let alertWeakPassword = this.alertCtrl.create({
                title: "Mot de passe pas assez securise",
                subTitle: "Le mot de passe doit contenir au moins 6 caracteres.",
                buttons: ['OK']
              });
              alertWeakPassword.present();
              this.user.password = "";
          break;
    }
  }
}
