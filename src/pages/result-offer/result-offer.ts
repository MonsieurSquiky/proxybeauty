import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { BookingPage } from '../booking/booking';
import { Geolocation } from '@ionic-native/geolocation';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the ResultOfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


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
    keyresults = [];
    address;
    close;
    loading;
    latitude;
    longitude;

    constructor(public loadingCtrl: LoadingController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public geolocation: Geolocation,
                private fdb: AngularFireDatabase,
                private platform : Platform,
                public alertCtrl: AlertController) {




        this.category = navParams.get('category');
        this.tags = navParams.get('tags');
        this.remote = navParams.get('remote');
        this.home = navParams.get('home');
        this.close = navParams.get('close');

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ResultOfferPage');
        this.fireSearch();
    }

    async fireSearch() {
        const obj = this;

        if (this.close.locate) {
            this.loading = this.loadingCtrl.create({
            content: 'Localisation en cours...'
            });
            this.loading.present();
            await this.geolocation.getCurrentPosition({maximumAge: 60000, timeout: 15000, enableHighAccuracy : false}).then((position) => {
                obj.loading.dismiss();
                obj.latitude = position.coords.latitude;
                obj.longitude = position.coords.longitude;
            }, (err) => {
                obj.loading.dismiss();
                let alert = obj.alertCtrl.create({
                  title: 'Erreur de geolocalisation',
                  subTitle: "Le service de localisation est momentanement indisponible, reessayer ulterieurement ou choisissez un autre mode de positionnement",
                  buttons: [{
                      text: 'Ok',
                      handler: () => {
                        obj.navCtrl.pop();
                      }
                    }]
                });
                alert.present();
            });
        }

        this.loading = this.loadingCtrl.create({
        content: 'Recherche en cours...'
        });

        this.loading.present();

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;
            if (obj.close.home) {
                var addressRef = obj.fdb.database.ref('/users/'+user.uid+'/address');
                addressRef.on('value', function(snapshot) {
                    obj.address = snapshot.val();
                });
            }

            var offersRef = obj.fdb.database.ref('/offers/');
            offersRef.on('value', function(snapshot) {
                snapshot.forEach( function(childSnapshot) {

                    if (childSnapshot.val().category == obj.category && obj.checkTags(childSnapshot.val())
                        && ( (obj.remote && childSnapshot.val().places.indexOf('remote') != -1) || (obj.home && childSnapshot.val().places.indexOf('home') != -1)) ) {
                        obj.results.push(childSnapshot.val());
                        obj.keyresults.push(Object.keys(childSnapshot.val())[0]);
                        if (obj.usersToCheck.indexOf(childSnapshot.val().prestataire) == -1)
                            obj.usersToCheck.push(childSnapshot.val().prestataire);
                        console.log(childSnapshot.val());
                    }


                  return false;
                });
                for (let presta of obj.usersToCheck)
                    obj.checkDistance(presta);
                console.log(obj.results);
                obj.loading.dismiss();

                if (obj.results.length == 0) {
                    let alertVerification = obj.alertCtrl.create({
                      title: "Aucune prestation correspondant à votre recherche",
                      subTitle: "Essayer de retirer quelques options et autorisez plus de modes de prestation.",
                      buttons: ['OK']
                    });
                    alertVerification.present();

                }
            });
            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });
    }
    checkTags(node) {
        if (this.tags.length == 0)
            return true;


      for (let t of this.tags) {
          let inSup = false;
          if (node.tags) {
              if (node.tags.indexOf(t) != -1)
                continue;
          }

          if (node.supplements) {
              for (let obj of node.supplements) {
                  if (obj.name == t) {
                      inSup = true;
                      break;
                  }
              }
          }
          if (!inSup)
              return false;
      }
      return true;
    }

    checkDate(userId) {
         var horaireRef = this.fdb.database.ref('/user-horaires/'+ userId);

    }

    checkDistance(userId) {
        var obj = this;

        if (this.close.home) {
            var addrRef = this.fdb.database.ref('/users/'+ userId);
            addrRef.on('value', function (snapshot) {
                let distance = obj.get_distance_m(snapshot.child('/address').val().latitude, snapshot.child('/address').val().longitude, obj.address.latitude, obj.address.longitude);
                //console.log(snapshot.child('/address').val());
                for (let i=0; i < obj.results.length; i++) {
                    if (obj.results[i].prestataire == userId) {
                        if (distance > 30000) {

                            obj.results.splice(i, 1);   // On retire l'offre a la i eme positon
                            i--;                        // Donc la prochaine offre se retrouve a l'indice i et non i+1 !!! La taille de notre liste a change. On decale notre curseur de 1 en arriere
                        }
                        else {
                            obj.results[i]['distance'] = precisionRound(distance / 1000, 1);
                            obj.results[i]['firstname'] = snapshot.val().firstname;
                            obj.results[i]['lastname'] = snapshot.val().lastname;
                            obj.results[i]['salonName'] = (snapshot.hasChild('proMode') && snapshot.val().proMode) ? snapshot.val().salonName : false;
                            obj.results[i]['address'] = snapshot.child('/address').val().place;
                            obj.results[i]['profilepic'] = (snapshot.child('/profilepic').val()) ? snapshot.child('/profilepic').val().url : "./assets/img/profilePic.png";
                            /*
                            obj.fdb.database.ref('/users-profilepics/'+userId+'/url').on('value', function(snapshot) {
                                obj.results[i]['profilepic'] = (snapshot.val()) ? snapshot.val() : "./assets/img/profilePic.png";
                            });
                            */
                        }
                    }
                }
            });
        }
        else if (this.close.locate) {
            var addrRef = this.fdb.database.ref('/users/'+ userId);
            addrRef.on('value', function (snapshot) {

            let lat = obj.latitude;
            let lng = obj.longitude;

            let distance = obj.get_distance_m(snapshot.child('/address').val().latitude, snapshot.child('/address').val().longitude, lat, lng);
            //console.log(snapshot.child('/address').val());
            for (let i=0; i < obj.results.length; i++) {
              if (obj.results[i].prestataire == userId) {
                  if (distance > 30000)
                      obj.results.splice(i, 1);
                  else {
                      obj.results[i]['distance'] = precisionRound(distance / 1000, 1);
                      obj.results[i]['firstname'] = snapshot.val().firstname;
                      obj.results[i]['lastname'] = snapshot.val().lastname;
                      obj.results[i]['salonName'] = (snapshot.hasChild('proMode') && snapshot.val().proMode) ? snapshot.val().salonName : false;
                      obj.results[i]['address'] = snapshot.child('/address').val().place;
                      obj.results[i]['profilepic'] = (snapshot.child('/profilepic').val()) ? snapshot.child('/profilepic').val().url : "./assets/img/profilePic.png";
                      /*
                      obj.fdb.database.ref('/users-profilepics/'+userId+'/url').on('value', function(snapshot) {
                          obj.results[i]['profilepic'] = (snapshot.val()) ? snapshot.val() : "./assets/img/profilePic.png";
                      });
                      */
                  }
              }
            }
            });
        }
        else if (this.close.zipcode) {
            var addrRef = this.fdb.database.ref('/users/'+ userId);

            addrRef.on('value', function (snapshot) {

                //console.log(snapshot.child('/address').val());
                for (let i=0; i < obj.results.length; i++) {
                    if (obj.results[i].prestataire == userId) {
                        if (obj.close.zipcode != snapshot.child('/address/details/postalCode').val().slice(0, obj.close.zipcode.length))
                            obj.results.splice(i, 1);
                        else {
                            //obj.results[i]['distance'] = precisionRound(distance / 1000, 1);
                            obj.results[i]['firstname'] = snapshot.val().firstname;
                            obj.results[i]['lastname'] = snapshot.val().lastname;
                            obj.results[i]['salonName'] = (snapshot.hasChild('proMode') && snapshot.val().proMode) ? snapshot.val().salonName : false;
                            obj.results[i]['address'] = snapshot.child('/address').val().place;
                            obj.results[i]['city'] = snapshot.child('/address/details/locality').val();
                            obj.results[i]['profilepic'] = (snapshot.child('/profilepic').val()) ? snapshot.child('/profilepic').val().url : "./assets/img/profilePic.png";
                            /*
                            obj.fdb.database.ref('/users-profilepics/'+userId+'/url').on('value', function(snapshot) {
                                obj.results[i]['profilepic'] = (snapshot.val()) ? snapshot.val() : "./assets/img/profilePic.png";
                            });
                            */
                        }
                    }
                }
            });
        }
    }

    getPrix(node) {
      var prixTotal = parseInt(node.prix, 10);
      for (let t of this.tags) {
         // Non opti : on fouille tous les supplements a chaque fois
         if (node.supplements) {
              for (let obj of node.supplements) {
                  if (obj.name == t) {
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
          if (node.supplements) {

              for (let obj of node.supplements) {
                  if (obj.name == t) {
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

    book(node, key) {
        //console.log(node.parent());
        let place = (this.remote) ? this.address.place : node.address;
        this.navCtrl.push(BookingPage, {place, offerKey: key, category: this.category, prestataire: node.prestataire, prix: this.getPrix(node),  duree: this.getDuree(node), tags: this.tags});
    }
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
