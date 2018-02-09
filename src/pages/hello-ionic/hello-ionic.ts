import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

import { DashboardPage } from '../dashboard/dashboard';
import { PrestaBoardPage } from '../presta-board/presta-board';
import { FirstloginTypePage } from '../firstlogin-type/firstlogin-type';

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


  constructor(  public navCtrl: NavController,
                public alertCtrl: AlertController,
                private afAuth: AngularFireAuth,
                private fdb: AngularFireDatabase,
                public facebook: Facebook,
                private googlePlus: GooglePlus) {
      var ref = this.fdb.database.ref("/users/mory/email");

      ref.on("value", function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              console.log(user.email);
              console.log(user.uid);
              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });
  }

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
      .then( response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then( success => {
            console.log("Firebase success: " + JSON.stringify(success));
            //HelloIonicPage.goDashboard();
          });

      }).catch((error) => { console.log(error) });
  }

  googleLogin(): void {
      this.googlePlus.login({
        'webClientId': '1090914691423-0p6mbq3ceg6092353jajc7d998e1cmah.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
              const googleCredential = firebase.auth.GoogleAuthProvider
                  .credential(res.idToken);

              firebase.auth().signInWithCredential(googleCredential)
            .then( response => {
                console.log("Firebase success: " + JSON.stringify(response));
                this.navCtrl.setRoot(DashboardPage);
            });
      }, err => {
          console.error("Error: ", err);
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
            console.log("Inscription annulee");
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
                  subTitle: 'Vous avez entrez 2 mots de passes differents, veuillez recommencer et entrer les memes.',
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
        this.navCtrl.setRoot(DashboardPage);
      }
    }
    catch (e) {
        console.error(e);
        this.errorLogs(e.code);

    }
  }

  goDashboard () {
      this.navCtrl.setRoot(DashboardPage);
  }

  async register(user: User) {
      console.log(user);
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {
          var userReg = firebase.auth().currentUser;
          var ref = this.fdb.database.ref("/users/"+ userReg.uid);
          ref.set({
            uid: userReg.uid,
            email: userReg.email
          });
        this.navCtrl.setRoot(FirstloginTypePage);

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
