import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the RatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rate',
  templateUrl: 'rate.html',
})
export class RatePage {
    note = 4;
    idRdv;
    idPresta;
    comment = "";
    uid;
    myData;
    rdvDate;
    tags;
    category;
    isRating: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase, public alertCtrl: AlertController) {
      this.idRdv = navParams.get('idRdv');
      this.idPresta = navParams.get('idPresta');
      this.rdvDate = navParams.get('rdvDate');
      this.category = navParams.get('category');
      this.tags = navParams.get('tags');

      this.isRating = navParams.get('isRating');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatePage');
    var obj = this;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          obj.uid = user.uid;
          var ref = firebase.database().ref('users/' + user.uid);
            ref.on('value', function(snapshot) {
              obj.myData = (snapshot.val()) ? snapshot.val() : false;
            });
        }
      });
    }

  setNote(note) {
      this.note = note;
  }
  saveReview() {

        let updates = {};

        updates['user-rdv/'+this.uid+'/'+this.idRdv+'/state'] = 'reviewed';
        updates['user-rdv/'+this.idPresta+'/'+this.idRdv+'/state'] = 'reviewed';
        updates['rdv/'+this.idRdv+'/state'] = 'reviewed';

        updates['user-rdv/'+this.uid+'/'+this.idRdv+'/review'] = { note: this.note, comment: this.comment };
        updates['user-rdv/'+this.idPresta+'/'+this.idRdv+'/review'] = { note: this.note, comment: this.comment ? this.comment : null};
        updates['rdv/'+this.idRdv+'/review'] = { note: this.note, comment: this.comment };

        let reviewKey = this.fdb.database.ref('reviews/'+this.idPresta).push().key;
        updates['reviews/'+this.idPresta+'/'+reviewKey] = { note: this.note,
                                                            comment: this.comment,
                                                            rdv: this.idRdv,
                                                            timestamp: this.rdvDate,
                                                            tags: (this.tags) ? this.tags : null,
                                                            category: this.category,
                                                            client: {   firstname: this.myData.firstname,
                                                                        lastname: this.myData.lastname,
                                                                        profilepic: this.myData.profilepic,
                                                                    }
                                                            };

        this.fdb.database.ref().update(updates);
        this.navCtrl.pop();
  }

  sendMessage() {
      if (this.comment === null || this.comment == "") {
          let alert = this.alertCtrl.create({
            title: 'Champ non rempli',
            subTitle: 'Veuillez expliquez en remplissant le champ les raisons de votre réclamation.',
            buttons: [{
                text: 'OK'
              }]
          });
          alert.present();
          return true;
      }
          let updates = {};

          updates['user-rdv/'+this.uid+'/'+this.idRdv+'/state'] = 'issued';
          updates['user-rdv/'+this.idPresta+'/'+this.idRdv+'/state'] = 'issued';
          updates['rdv/'+this.idRdv+'/state'] = 'issued';

          updates['user-rdv/'+this.uid+'/'+this.idRdv+'/reclaim'] = this.comment;
          updates['user-rdv/'+this.idPresta+'/'+this.idRdv+'/reclaim'] =  this.comment;
          updates['rdv/'+this.idRdv+'/reclaim'] = this.comment;

          this.fdb.database.ref().update(updates);
          this.navCtrl.pop();
  }
}
