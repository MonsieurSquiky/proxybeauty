import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { PrestaBoardPage } from '../presta-board/presta-board';

/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage({
     name: 'schedule'
 })
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
    uid;
    days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    horaire= [];
    picked = [];
    pickCols = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase, public alertCtrl: AlertController) {
        for (let i=6; i< 23; i++) {
            this.horaire.push(i+"h - "+(i+1)+"h");
        }

        for (let i=0; i < this.days.length; i++) {
            var row = [];
            for (let j=0; j < this.horaire.length; j++) {
                row.push(false);
            }
            this.picked.push(row);
        }

        for (let i=0; i < this.days.length; i++) {

            this.pickCols.push(false);
        }

        var obj = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;

              var horairesRef = fdb.database.ref('/user-horaires/' + obj.uid);
              horairesRef.on('value', function(snapshot) {
                  obj.picked = (snapshot.val()) ? snapshot.val() : obj.picked;
                  console.log(snapshot.val());
              });
              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });

        console.log(this.picked);
    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
    }

    goBoard() {
        this.navCtrl.setRoot(PrestaBoardPage);

    }

    resetPicked() {
        for (let i=0; i < this.days.length; i++) {
            var row = [];
            for (let j=0; j < this.horaire.length; j++) {
                row.push(false);
            }
            this.picked[i] = row;
        }
        console.log(this.picked);
    }

    pickCol(index) {
        for (let j=0; j < this.horaire.length; j++) {
            this.picked[index][j] =  (this.pickCols[index]) ? false : true;
        }
        this.pickCols[index] = (this.pickCols[index]) ? false : true;
    }

    saveSchedule() {
        //var newPostKey = firebase.database().ref().child('horaires').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/user-horaires/' + this.uid] = this.picked;


        let success = this.fdb.database.ref().update(updates);

        if (success) {
            let alert = this.alertCtrl.create({
              title: 'Sauvegarde effectuée',
              subTitle: 'Votre emploi du temps a bien été mis à jour',
              buttons: ['OK']
            });
            alert.present();
        }
        else {
            let alert = this.alertCtrl.create({
              title: 'Echec de la sauvegarde',
              subTitle: 'Vérifiez votre connexion internet et réessayez ultérieurement',
              buttons: ['OK']
            });
            alert.present();
        }

    }
}
