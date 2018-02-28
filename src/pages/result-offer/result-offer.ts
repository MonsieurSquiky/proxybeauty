import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { BookingPage } from '../booking/booking';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the ResultOfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result-offer',
  templateUrl: 'result-offer.html',
})
export class ResultOfferPage {
    uid;
    category: string;
    tags: string[];
    remote: boolean;
    home: boolean;
    usersToCheck = [];
    results = [];
    address;

    constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase) {
        let loading = this.loadingCtrl.create({
        content: 'Recherche en cours...'
        });

        loading.present();


        this.category = navParams.get('category');
        this.tags = navParams.get('tags');
        this.remote = navParams.get('remote');
        this.home = navParams.get('home');


        var obj = this;
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;

            var addressRef = fdb.database.ref('/users/'+user.uid+'/address');
            addressRef.on('value', function(snapshot) {
                obj.address = snapshot.val();
            });

            var offersRef = fdb.database.ref('/offers/');
            offersRef.on('value', function(snapshot) {
                snapshot.forEach( function(childSnapshot) {
                    if (childSnapshot.val().category == obj.category && obj.checkTags(childSnapshot.val())
                        && ( (obj.remote && childSnapshot.val().places.indexOf('remote') != -1) || (obj.home && childSnapshot.val().places.indexOf('home') != -1)) ) {
                        obj.results.push(childSnapshot.val());
                        if (obj.usersToCheck.indexOf(childSnapshot.val().prestataire) == -1)
                            obj.usersToCheck.push(childSnapshot.val().prestataire);
                        console.log(childSnapshot.val());
                    }


                  return false;
                });
                for (let presta of obj.usersToCheck)
                    obj.checkDistance(presta);
                console.log(obj.results);
                loading.dismiss();
            });
            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });
    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad ResultOfferPage');
    }

    checkTags(node) {
        node.prixTotal = node.prix;
      for (let t of this.tags) {
          if (node.tags.indexOf(t) == -1) {
              let count = 0;
              if (node.supplements) {
                  for (let obj of node.supplements) {
                      if (obj.name == t) {
                          count += 1;
                          node.prixTotal += obj.prix;
                          break;
                      }
                  }
              }
              if (count == 0)
                return false;
          }
      }
      return true;
    }

    checkDate(userId) {
         var horaireRef = this.fdb.database.ref('/user-horaires/'+ userId);

    }

    checkDistance(userId) {
        var obj = this;
        var addrRef = this.fdb.database.ref('/users/'+ userId);
        addrRef.on('value', function (snapshot) {
            let distance = obj.get_distance_m(snapshot.child('/address').val().latitude, snapshot.child('/address').val().longitude, obj.address.latitude, obj.address.longitude);
            console.log(snapshot.child('/address').val());
            for (var i=0; i < obj.results.length; i++) {
                if (obj.results[i].prestataire == userId) {
                    if (distance > 10000)
                        obj.results.splice(i, 1);
                    else {
                        obj.results[i]['distance'] = precisionRound(distance / 1000, 1);
                        obj.results[i]['firstname'] = snapshot.val().firstname;
                        obj.results[i]['lastname'] = snapshot.val().lastname;
                        obj.results[i]['address'] = snapshot.child('/address').val().place;
                    }
                }
            }
        });
    }

    getPrix(node) {
      var prixTotal = parseInt(node.prix, 10);
      for (let t of this.tags) {
          if (node.tags.indexOf(t) == -1) {
              let count = 0;
              for (let obj of node.supplements) {
                  if (obj.name == t) {
                      count += 1;
                      prixTotal += parseInt(obj.prix, 10);
                      break;
                  }

              }
          }
      }
      return prixTotal;
    }

    getDuree(node) {
      var dureeTotal = parseInt(node.duree, 10);
      for (let t of this.tags) {
          if (node.tags.indexOf(t) == -1) {
              let count = 0;
              for (let obj of node.supplements) {
                  if (obj.name == t) {
                      count += 1;
                      dureeTotal += parseInt(obj.duree, 10);
                      break;
                  }

              }
          }
      }
      return dureeTotal;
    }

    deg2rad(x){
      return Math.PI*x/180;
    }

    get_distance_m(lat1, lng1, lat2, lng2) {
      let earth_radius = 6378137;   // Terre = sphère de 6378km de rayon
      let rlo1 = this.deg2rad(lng1);    // CONVERSION
      let rla1 = this.deg2rad(lat1);
      let rlo2 = this.deg2rad(lng2);
      let rla2 = this.deg2rad(lat2);
      let dlo = (rlo2 - rlo1) / 2;
      let dla = (rla2 - rla1) / 2;
      let a = (Math.sin(dla) * Math.sin(dla)) + Math.cos(rla1) * Math.cos(rla2) * (Math.sin(dlo) * Math.sin(dlo
    ));
      let d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      console.log(earth_radius * d);
      return (earth_radius * d);
    }

    book(node) {
        //console.log(node.parent());
        this.navCtrl.push(BookingPage, {category: this.category, prestataire: node.prestataire, prix: this.getPrix(node),  duree: this.getDuree(node), tags: this.tags});
    }
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
