import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { PrestaBoardPage } from '../presta-board/presta-board';
import { DashboardPage } from '../dashboard/dashboard';
import { ModalController } from 'ionic-angular';
import { AutocompletePage } from '../autocomplete/autocomplete';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

import { AngularFireDatabase } from 'angularfire2/database';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';
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

    constructor(public navCtrl: NavController,
                private fdb: AngularFireDatabase,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                private modalCtrl:ModalController,
                public _GEOCODE   : GeocoderProvider) {
        var obj = this;

        this.address = {
          place: ''
        };

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
              navCtrl.setRoot(HelloIonicPage);
            }
          });
    }

    showAddressModal () {
      let modal = this.modalCtrl.create(AutocompletePage);
      let me = this;
      modal.onDidDismiss(data => {
        this.address.place = data['address'];
        this.latitude = data['lat'];
        this.longitude = data['long'];
      });
      modal.present();
    }

    goToDashboard () {
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

    }

    async saveAddress() {
        const obj = this;
        var ref = this.fdb.database.ref("/users/"+ this.uid +"/address");
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': this.address.place }, (results, status) => {
            ref.update({

                'latitude': results[0].geometry.location.lat(),
                'longitude': results[0].geometry.location.lng()
            });

            obj.performReverseGeocoding(results[0].geometry.location.lat(), results[0].geometry.location.lng());

        });
        ref.update({
            'place': this.address.place
        }).then(function() {
          obj.navCtrl.push(SetAddressPage);
        }).catch(function(error) {
          // An error happened.
          let alertVerification = obj.alertCtrl.create({
            title: "Echec",
            subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
            buttons: ['OK']
          });
          alertVerification.present();
        });
        this.goToDashboard();
    }

    async performReverseGeocoding(latitude, longitude)
    {
          let ref = this.fdb.database.ref("/users/"+ this.uid +"/address");
           /*
          let latitude     : any = parseFloat(this.geoForm.controls["latitude"].value),
              longitude    : any = parseFloat(this.geoForm.controls["longitude"].value);
              */
          this._GEOCODE.reverseGeocode(latitude, longitude)
          .then((data : any) =>
          {
             //this.geocoded      = true;
             console.log("Happens HERE "+ data.countryCode);
             ref.update({
                 'details': data
             });

          })
          .catch((error : any)=>
          {
             //this.geocoded      = true;

             console.log(error.message);
          });
    }
}
