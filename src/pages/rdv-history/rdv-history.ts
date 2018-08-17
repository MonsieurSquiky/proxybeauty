import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PrestaBoardPage } from '../presta-board/presta-board';
import { RatePage } from '../rate/rate';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the RdvHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rdv-history',
  templateUrl: 'rdv-history.html',
})
export class RdvHistoryPage {
    uid;
    statut;
    rdvList= [];
    dates = [];
    daysName = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
    months = ['Jan', 'Fév', 'Mar', 'Av', 'Mai', 'J', 'Jui', 'A', 'Sep', 'Oct', 'Nov', 'Déc'];
    now;
    address;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fdb: AngularFireDatabase,) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PrestaRdvPage');
        var obj = this;
        this.now = new Date();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;

              let addressRef = obj.fdb.database.ref('/users/'+user.uid+'/address');
              addressRef.on('value', function(snapshot) {
                  obj.address = (snapshot.val().place) ? snapshot.val().place : false;
              });

              let statutRef = obj.fdb.database.ref('/users/'+user.uid+'/statut');
              statutRef.once('value', function(snapshot) {
                  obj.statut = (snapshot.val()) ? snapshot.val() : 'client';
              }).then( () => {
                  let rdvRef = obj.fdb.database.ref('/user-rdv/'+obj.uid);
                  rdvRef.on('value', function(snapshot) {
                    obj.rdvList= []; // on remet la liste a zero en cas de rafraichissement pour eviter les doublons
                      snapshot.forEach( function(childSnapshot) {
                          if (childSnapshot.val().timestamp <= obj.now.getTime()) {
                              let nextRdv = childSnapshot.val();
                              nextRdv['key'] = childSnapshot.key;
                              obj.rdvList.push(nextRdv);


                              let encounter = (obj.statut == 'client') ? 'prestataire' : 'client';

                              let ref = obj.fdb.database.ref('/users/'+nextRdv[encounter]);
                              ref.once('value', function(snapshot) {
                                  nextRdv['details'] = (snapshot.val()) ? snapshot.val() : false;
                              }).catch( (error) => { console.log('Encounter id ' + error) });
                          }
                        // else detruire le rdv
                        return false;
                      });

                      if (obj.rdvList.length == 0) {
                          let alertVerification = obj.alertCtrl.create({
                            title: "Historique vide",
                            subTitle: "Vous n'avez effectué aucun rendez vous jusqu'à présent.",
                            buttons: ['OK']
                          });
                          alertVerification.present();

                      }

                      obj.rdvList.sort(function (a, b) {
                        return a.timestamp - b.timestamp;
                      });
                      obj.rdvList.reverse();
                      //console.debug(obj.rdvList);
                      obj.setRdvDays();

                  });
              });


              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });

    }


    goBoard() {
        this.navCtrl.setRoot(PrestaBoardPage);
    }

    prestaConfirm(idRdv, idPresta, idClient) {
        const obj = this;

        let alertConfirm = obj.alertCtrl.create({
          title: "Confirmation du rendez-vous",
          subTitle: "La confirmation devrait être réalisée par le prestataire. Une fois le rendez-vous confirmé, vous déclarez qu'il a bien eu lieu et ne pourrez plus faire de réclamations",
          buttons: [
            {
              text: 'Annuler',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'Confirmer',
              handler: () => {
                  let updates = {};

                  updates['rdv/'+idRdv+'/state'] = 'confirmed';
                  updates['user-rdv/'+idClient+'/'+idRdv+'/state'] = 'confirmed';
                  updates['user-rdv/'+idPresta+'/'+idRdv+'/state'] = 'confirmed';

                  obj.fdb.database.ref().update(updates);


              }
            }
          ]
        });
        alertConfirm.present();


    }

    reclaim(idRdv, idPresta, rdvDate, category, tags) {
        this.navCtrl.push(RatePage, { idRdv, idPresta, rdvDate, category, tags, isRating: false});
    }

    rate(idRdv, idPresta, rdvDate, category, tags) {
        this.navCtrl.push(RatePage, { idRdv, idPresta, rdvDate, category, tags, isRating: true});
    }

    setRdvDays() {
        for(let rdv of this.rdvList) {
            let rdvDate = new Date(rdv.timestamp);
            rdv.hour = rdvDate.getHours();
            rdv['date'] = [rdvDate.getDay(), rdvDate.getDate(), rdvDate.getMonth(), rdv.timestamp];
            if (!isItemInArray(this.dates, rdv['date']))
              this.dates.push(rdv['date']);
        }
    }

    diffdate(d1,d2){
      var WNbJours = d2 - d1;
      return Math.ceil(WNbJours/(1000*60*60*24));
    }

   }

   function isItemInArray(array, item) {
      for (var i = 0; i < array.length; i++) {
          // This if statement depends on the format of your array
          if (array[i][0] == item[0] && array[i][1] == item[1] && array[i][2] == item[2]) {
              return true;   // Found it
          }
      }
      return false;   // Not found
   }
