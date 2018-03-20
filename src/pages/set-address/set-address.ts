import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';

import { ModalController } from 'ionic-angular';
import { AutocompletePage } from '../autocomplete/autocomplete';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { ProfilepicPage } from '../profilepic/profilepic';

import { AngularFireDatabase } from 'angularfire2/database';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
/**
 * Generated class for the SetAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-address',
  templateUrl: 'set-address.html',
})
export class SetAddressPage {

    isPresta: boolean = false;
    address: any;
    latitude: number = 0;
    longitude: number = 0;
    uid: string;
    loading;

    constructor(public navCtrl: NavController,
                private fdb: AngularFireDatabase,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                private modalCtrl:ModalController,
                private loadingCtrl: LoadingController,
                public geolocation: Geolocation,
                public _GEOCODE   : GeocoderProvider,
                private platform : Platform) {

        this.address = {
          place: navParams.get('place')
        };
    }

    ionViewDidLoad() {

        var obj = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;

              var statut = firebase.database().ref('users/' + user.uid + '/statut');
                statut.on('value', function(snapshot) {
                  obj.isPresta = (snapshot.val() == "prestataire") ? true : false;
                });


              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
              obj.navCtrl.setRoot(HelloIonicPage);
            }
          });
    }

    showAddressModal () {
      let modal = this.modalCtrl.create(AutocompletePage);
      let me = this;
      modal.onDidDismiss(data => {
        this.address.place = data ? data['address'] : null;
        this.address['details'] = null;
      });
      modal.present();
    }

    goToDashboard () {
        if (this.navParams.get('update'))
            this.navCtrl.pop();
        else
            this.navCtrl.push(ProfilepicPage);

        /*
        var ref = this.fdb.database.ref("/users/"+ this.uid);
        var obj = this;
        ref.on("value", function(snapshot) {
            if (snapshot.val().statut == "client")
              obj.navCtrl.setRoot(DashboardPage);
            else
              obj.navCtrl.setRoot(PrestaBoardPage);
          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          });
          */
    }
    findMe() {
        this.loading = this.loadingCtrl.create({
        content: 'Localisation en cours...'
        });
        const obj = this;

        this.loading.present();
        this.geolocation.getCurrentPosition().then((position) => {
            obj.latitude = position.coords.latitude;
            obj.longitude = position.coords.longitude;
            this.performReverseGeocoding(position.coords.latitude, position.coords.longitude, 'show');

        }, (err) => {
            obj.loading.dismiss();
            console.log(err);
        });
    }
    async saveAddress() {
        const obj = this;

        this.loading = this.loadingCtrl.create({
        content: 'Sauvegarde en cours...'
        });

        this.loading.present();

        if (this.address.details) {
            this.fdb.database.ref("/users/"+ this.uid).update({
                'address': {
                    'place': obj.address.place,
                    'latitude': this.latitude,
                    'longitude': this.longitude,
                    'details': this.address.details
                },
                setupStep: this.navParams.get('update') ? 'complete' : 3
            }).then(function() {
                obj.loading.dismiss();
               obj.goToDashboard();

            }).catch(function(error) {
              // An error happened.
              console.log(error);
              obj.loading.dismiss();
              let alertVerification = obj.alertCtrl.create({
                title: "Echec",
                subTitle: "Une erreur est survenue, assurez vous d'avoir autorisé les permissions demandées par l'application et veuillez vérifier votre connexion internet puis réessayer.",
                buttons: ['OK']
              });
              alertVerification.present();
            });
        }
        else {
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': this.address.place }, (results, status) => {

                obj.performReverseGeocoding(results[0].geometry.location.lat(), results[0].geometry.location.lng(), 'save');

            });
        }

        /*
        ref.update({
            'place': this.address.place
        }).then(function() {
          //obj.navCtrl.push(SetAddressPage);
        }).catch(function(error) {
          // An error happened.
          let alertVerification = obj.alertCtrl.create({
            title: "Echec",
            subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
            buttons: ['OK']
          });
          alertVerification.present();
        });
        */
    }

    async performReverseGeocoding(latitude, longitude, task)
    {
          var obj = this;
          let ref = this.fdb.database.ref("/users/"+ this.uid);
           /*
          let latitude     : any = parseFloat(this.geoForm.controls["latitude"].value),
              longitude    : any = parseFloat(this.geoForm.controls["longitude"].value);
              */
          this._GEOCODE.reverseGeocode(latitude, longitude)
          .then((data : any) =>
          {
             //this.geocoded      = true;
             //console.log("Happens HERE "+ data.countryCode);
             if (task == 'save') {

                 ref.update({
                     'address': {
                         'place': obj.address.place,
                         'latitude': latitude,
                         'longitude': longitude,
                         'details': data
                     },
                     'setupStep': 3
                 }).then(function() {
                     obj.loading.dismiss();
                    obj.navCtrl.push(ProfilepicPage);

                 }).catch(function(error) {
                   // An error happened.
                   console.log(error);
                   obj.loading.dismiss();
                   let alertVerification = obj.alertCtrl.create({
                     title: "Echec",
                     subTitle: "Une erreur est survenue, assurez vous d'avoir autorisé les permissions demandées par l'application et veuillez vérifier votre connexion internet puis réessayer.",
                     buttons: ['OK']
                   });
                   alertVerification.present();
                 });
             }
             else {
                obj.address.place = data.subThoroughfare + data.thoroughfare + ', ' + data.locality + ', ' + data.countryName;
                obj.address['details'] = data;
                obj.loading.dismiss();
             }

          })
          .catch((error : any)=>
          {
              // An error happened.
              obj.loading.dismiss();
              let alertVerification = obj.alertCtrl.create({
                title: "Echec",
                subTitle: "Une erreur est survenue, assurez vous d'avoir autorisé les permissions demandées par l'application et veuillez vérifier votre connexion internet puis réessayer.",
                buttons: ['OK']
              });
              alertVerification.present();
             console.log(error.message);
          });
    }
}
