import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { PaybookingPage } from '../paybooking/paybooking';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the BookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

    uid;
    dates = [[], [], [], [], [], [], []];
    days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    //disableHour = false;
    today;
    horaire= [];
    schedule = [];
    picked = [];
    pickCols = [];
    category: string;
    tags: string[];
    prestataire;
    prix;
    place;
    duree;
    offerKey;

    constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase, public alertCtrl: AlertController) {
        this.offerKey = navParams.get('offerKey');
        this.category = navParams.get('category');
        this.tags = navParams.get('tags');
        this.prestataire = navParams.get('prestataire');
        this.prix = navParams.get('prix');
        this.duree = navParams.get('duree');
        this.place = navParams.get('place');

        this.today = new Date();

        let dayNumber = ( this.today.getDay() > 0) ?  this.today.getDay() - 1 : 6;


        for (let d=0; d < 7; d++) {
            let day = this.today.getDate();
            if (d < dayNumber)
                day +=  -(dayNumber - d);
            else
                day += (d - dayNumber);


            for (let i=6; i< 23; i++) {
                let date = new Date();
                date.setDate(day);
                date.setHours(i);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                this.dates[d].push(date);
            }
        }

        for (let i=6; i< 23; i++) {
            this.horaire.push(i+"h");
        }

        for (let i=0; i < this.days.length; i++) {
            let row1 = [];
            let row2 = [];
            for (let j=0; j < this.horaire.length; j++) {
                row1.push(false);
                row2.push({});
            }
            this.schedule.push(row1);
            this.picked.push(row2);
        }

        for (let i=0; i < this.days.length; i++) {

            this.pickCols.push(false);
        }

        var obj = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;

              let horairesRef = fdb.database.ref('/user-horaires/'+obj.prestataire);
              horairesRef.on('value', function(snapshot) {
                  obj.schedule = (snapshot.val()) ? snapshot.val() : obj.schedule;
                  //console.log(snapshot.val());
              });

              let rdvPrestaRef = fdb.database.ref('/user-rdv/'+obj.prestataire);
              rdvPrestaRef.on('value', function(snapshot) {
                  snapshot.forEach( function(childSnapshot) {
                      if (childSnapshot.exists()) {
                          console.log(childSnapshot.val().timestamp);
                          let date = new Date(childSnapshot.val().timestamp);

                          let dayNumber = ( date.getDay() > 0) ?  date.getDay() - 1 : 6;
                          let hourIndice = date.getHours() - 6;

                          console.log(dayNumber, hourIndice);

                          let day = date.getDate();
                          let month = date.getMonth();
                          let year = date.getFullYear();

                          // On met le timestamp du rendez vous a la bonne place dans le tableau picked (de la semaine)
                          // En plus on lui met en cle la date exacte en chaine de caractere pour pouvoir comparer avec le tableau date
                          obj.picked[dayNumber][hourIndice][day+month+year] = childSnapshot.val().timestamp;

                      }


                    return false;
                  });
                  console.log(snapshot.val());
              });
              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
            }
          });

    }
    book(event: any, hour, day) {
        var obj = this;
        var month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        let confirm = this.alertCtrl.create({
          title: 'Réserver ?',
          message: 'Voulez vous réserver pour le '+ this.days[day] + " " + this.dates[day][hour].getDate() + " " + month[this.dates[day][hour].getMonth()]+ ' à ' + this.dates[day][hour].getHours() + "h pour un rendez-vous " + this.category + " au prix de " + this.prix +"€ ? ",
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
                obj.navCtrl.push(PaybookingPage, {
                    product: {type: 'offer', key: obj.offerKey, tags: obj.tags, duree: obj.duree, place: obj.place, category: obj.category },
                    timestamp: obj.dates[day][hour].getTime(),
                    prix: obj.prix,
                    destinataire: obj.prestataire });
              }
            }
          ]
        });
        confirm.present();
    }


    nextWeek() {
        for (let d=0; d < this.dates.length; d++) {
            for (let i=0; i < this.dates[d].length; i++) {
                let dayNumber = this.dates[d][i].getDate();
                this.dates[d][i].setDate(dayNumber + 7);
            }
        }
    }

    previousWeek() {
        for (let d=0; d < this.dates.length; d++) {
            for (let i=0; i < this.dates[d].length; i++) {
                let dayNumber = this.dates[d][i].getDate();
                this.dates[d][i].setDate(dayNumber - 7);
            }
        }
    }

}

function modulo(num, mod) {


  var reste = num % mod;
  console.log(mod);
  if (reste > 0)
    return reste;
  else
    return mod+reste;

}
