import {Component, NgZone} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';

@Component({
    selector: 'page-autocomplete',
    templateUrl: 'autocomplete.html',
})

export class AutocompletePage {
    autocompleteItems;
    autocomplete;

    latitude: number = 0;
    longitude: number = 0;
    geo: any

    service = new google.maps.places.AutocompleteService();

    constructor (public viewCtrl: ViewController, private zone: NgZone, public _GEOCODE   : GeocoderProvider) {
      this.autocompleteItems = [];
      this.autocomplete = {
        query: ''
      };
    }

    dismiss() {
      this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {

        this.geo = item;
        //this.geoCode(this.geo);//convert Address to lat and long
        this.viewCtrl.dismiss({'address': item, 'lat': this.latitude, 'long': this.longitude });
    }

    updateSearch() {
      if (this.autocomplete.query == '') {
        this.autocompleteItems = [];
        return;
      }
      let me = this;

      this.service.getPlacePredictions({ input: this.autocomplete.query,  componentRestrictions: {country: 'FR'} }, function (predictions, status) {
        me.autocompleteItems = [];
        me.zone.run(function () {
            if (predictions) {
              predictions.forEach(function (prediction) {
                me.autocompleteItems.push(prediction.description);
              });
            }

        });
      });
    }

    //convert Address string to lat and long
    async geoCode(address:any) {

      let geocoder = new google.maps.Geocoder();
      await geocoder.geocode({ 'address': address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      console.log(this.latitude);
      //alert("lat: " + this.latitude + ", long: " + this.longitude);
     });
   }

   async performReverseGeocoding(latitude, longitude)
   {

          /*
         let latitude     : any = parseFloat(this.geoForm.controls["latitude"].value),
             longitude    : any = parseFloat(this.geoForm.controls["longitude"].value);
             */
         this._GEOCODE.reverseGeocode(latitude, longitude)
         .then((data : any) =>
         {
            //this.geocoded      = true;
            console.log(data);

         })
         .catch((error : any)=>
         {
            //this.geocoded      = true;
            console.log(error.message);
         });
   }
}
