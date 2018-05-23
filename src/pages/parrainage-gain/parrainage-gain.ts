import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the ParrainageGainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-parrainage-gain',
  templateUrl: 'parrainage-gain.html',
})
export class ParrainageGainPage {
    uid;
    userList = [];
    userDetails = [];
    gains = {};
    now;


    constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase,) {
        var obj = this;
        this.now = new Date();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;

              fdb.database.ref('/users/'+obj.uid+'/statut').on('value', function(snapshot) {
                  obj.userList = [];
                  obj.userDetails = [];
                  obj.gains = {};
                  obj.getGains(snapshot.val());
              });
              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ParrainageGainPage');
  }

  getGains(statut) {
      var obj = this;
      let refGains;
      console.log(statut);
      if (statut == 'prestataire')
          refGains = this.fdb.database.ref('/prestataire-gains/'+this.uid);
      else
          refGains = this.fdb.database.ref('/parrain-gains/'+this.uid);

      refGains.on('value', function(snapshot) {
          snapshot.forEach( function(userSnapshot) {
              obj.userList.push(userSnapshot.key);
              obj.gains[userSnapshot.key] = 0;

              userSnapshot.forEach( function(transactionSnapshot) {
                obj.gains[userSnapshot.key] += transactionSnapshot.val().amount/100;

                return false;
              });
            return false;
          });
          console.debug(obj.gains);
          obj.setUsersInfo();
      });

  }

  setUsersInfo() {
      var obj = this;
      var users = {};
      for (let userid of this.userList) {
          this.fdb.database.ref('/users/'+userid).on('value', function(snapshot) {
              if (snapshot.val()) {
                  let u = snapshot.val();
                  console.log(u.statut);
                  obj.userDetails.push( { uid: userid,
                            firstname: u.firstname,
                            lastname: u.lastname,
                            statut: u.statut,
                            profilepic: (u.profilepic) ? u.profilepic.url : "./assets/img/profilePic.png"});
              }
          });
      }
      //this.userDetails = users;
  }

  getTotalGain() {
      var s = 0;
      for (let gain in this.gains) {
          s += this.gains[gain];
      }
      return s;
  }

  goToAccounts() {
      this.navCtrl.push('BankaccountPage');
  }

}
