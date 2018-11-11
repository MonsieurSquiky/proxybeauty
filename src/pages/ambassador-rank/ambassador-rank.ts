import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the AmbassadorRankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ambassador-rank',
  templateUrl: 'ambassador-rank.html',
})
export class AmbassadorRankPage {
    uid;
    nbRdv = 0;
    nbRank = [0, 0, 0, 0];
    rank = 0;
    nextStep = [2, 2, 2];
    nextRank = ['Bronze', 'Argent', 'Or'];
    widthBar= 0;
    giftList = [];
    constructor(  public navCtrl: NavController,
                  public navParams: NavParams,
                  private fdb: AngularFireDatabase,
                  public loadingCtrl:LoadingController,
                  public alertCtrl:AlertController) {

    }

    ionViewDidLoad() {
        const obj = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
              console.log('In');
              let rdvRef = obj.fdb.database.ref('/parrains/' + obj.uid+'/filleuls');
              rdvRef.on('value', function(snapshot) {
                  obj.nbRank = [0, 0, 0, 0];
                  console.log(snapshot.val());
                  snapshot.forEach( function(childSnapshot) {
                      console.log(childSnapshot.key);
                      obj.nbRank[0] += 1;
                      if (childSnapshot['rank'] >= 1)
                          obj.nbRank[1] += 1; //Bronze

                      if (childSnapshot['rank'] >= 2)
                          obj.nbRank[2] += 1; // Silver
                      if (childSnapshot['rank'] >= 3)
                          obj.nbRank[3] += 1; // Gold

                    return false;
                  });
                  console.log(obj.nbRank);
                  obj.widthBar = Math.round((obj.nbRank[0]) / (obj.nextStep[0]) * 100);
              });

              let palierRef = obj.fdb.database.ref('/parrains/' + obj.uid);
              palierRef.on('value', function(snapshot) {
                  obj.rank = snapshot.child('rank').val();
                  console.log(obj.rank);
                  obj.widthBar = Math.round((obj.nbRank[obj.rank]) / obj.nextStep[obj.rank] * 100);

              });


              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });

      console.log('ionViewDidLoad GiftPage');
    }

    getGift(gift) {
        //this.navCtrl.push(ProductPage, {isGift: true, idList: gift.ids, qte: gift.qte, giftId: gift['key'] });
    }

    unlockGift() {
        if (this.nbRank[this.rank] < this.nextStep[this.rank])
            return null;

        this.fdb.database.ref('/parrains/' + this.uid+'/checkin').set(this.rank);

        let loading = this.loadingCtrl.create({
        content: 'Évolution de votre rang en cours...'
        });

        loading.present();
        var obj = this;
        // On detecte le resultat de la verification en checkant la bdd
        this.fdb.database.ref('/parrains/' + this.uid+'/checkin').on('value', function(snapshot) {
            if (snapshot.exists() && !Number.isInteger(snapshot.val()) && snapshot.val() !== null) {
                loading.dismiss();
                if (snapshot.val() == 'success') {
                    obj.widthBar = Math.round((obj.nbRank[obj.rank]) / obj.nextStep[obj.rank] * 100);
                    let alert = obj.alertCtrl.create({
                        title: 'Evolution réussi',
                        subTitle: "Vous bénéficiez désormais des avantages d'un ambassadeur "+ obj.nextRank[obj.rank-1] +" !",
                        buttons: [{
                            text: 'Parfait !'
                        }]
                    });
                    alert.present();
                }
                else if (snapshot.val() == 'failed') {
                    let alert = obj.alertCtrl.create({
                        title: 'Conditions non remplies',
                        subTitle: "Vous n'avez pas encore complété tous les critères pour débloquer le prochain rang",
                        buttons: [{
                            text: 'Ok'
                        }]
                    });
                    alert.present();
                }
                else {
                    let alert = obj.alertCtrl.create({
                        title: 'Erreur lors du déblocage',
                        subTitle: "Une erreur s'est produite, veuillez réessayer ultérieurement",
                        buttons: [{
                            text: 'Ok'
                        }]
                    });
                    alert.present();
                }

            }
        });
    }

}
