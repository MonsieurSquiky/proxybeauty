import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

import { PrestaBoardPage } from '../presta-board/presta-board';
import { DashboardPage } from '../dashboard/dashboard';
import { ReqHttpProvider } from '../../providers/req-http/req-http';

/**
 * Generated class for the ConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conditions',
  templateUrl: 'conditions.html',
})
export class ConditionsPage {

    uid;
    accept;
    loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public request: ReqHttpProvider) {

  }

  ionViewDidLoad() {

      var obj =this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
            } else {
              // No user is signed in.
              obj.navCtrl.setRoot(HelloIonicPage);
            }
          });
    console.log('ionViewDidLoad ConditionsPage');
  }

  goNext() {
      console.log('Clicked');
      if (this.accept) {
          var obj = this;

          obj.loading = obj.loadingCtrl.create({
          content: 'Création du compte...'
          });
          obj.loading.present();
          obj.request.callFirebaseConditions('acceptConditions', { uid: obj.uid}, [obj.loading], obj);
          /*
          firebase.database().ref('/user-gift/'+ this.uid+'/palier').set(0).then(function() {
              firebase.database().ref('/users/'+ obj.uid +'/setupStep').set('complete')
              .then(function() {
                  obj.loading = obj.loadingCtrl.create({
                  content: 'Création du compte...'
                  });
                  obj.loading.present();
                  obj.request.callFirebaseConditions('acceptConditions', { uid: obj.uid}, [obj.loading], obj);

              }, error => {
                  let alertVerification = obj.alertCtrl.create({
                    title: "Echec",
                    subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
                    buttons: ['OK']
                  });
                  alertVerification.present();

                // Log an error to the console if something goes wrong.
                console.log("ERROR -> " + JSON.stringify(error));
              });
          }).catch( (error) => { console.log("ERROR -> " + JSON.stringify(error)); });
          */
      }
      else {
          let alertVerification = this.alertCtrl.create({
            title: "Conditions non acceptées",
            subTitle: "Vous devez accepter les Conditions générales pour pouvoir finaliser votre inscription.",
            buttons: ['OK']
          });
          alertVerification.present();
      }
  }

  goDashboard() {

      var ref = firebase.database().ref("/users/"+ this.uid);
      var obj = this;

      let updates = {};
      updates['/user-gift/'+ this.uid+'/palier'] = 0;
      updates['/users/'+ obj.uid +'/setupStep'] = 'complete';

      firebase.database().ref().update(updates).then( function () {
          ref.on("value", function(snapshot) {
              if (snapshot.val().statut == "client")
                obj.navCtrl.setRoot(DashboardPage);
              else
                obj.navCtrl.setRoot(PrestaBoardPage);
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
      });


  }
}
