import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';

declare var google;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    /**
     * Define a string value to handle returned geocoding results
     */
    public results: string;
    /**
     * Define a boolean property to reference whether geocoding has been
     * performed or not
     */
    public geocoded: boolean;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public geolocation: Geolocation,
                public _GEOCODE   : GeocoderProvider,
                private platform : Platform) {
        platform.ready().then(() => {
        this.loadMap();
      });

    }

    ionViewDidLoad(){
      //this.loadMap();

    }

    loadMap(){
        console.log(this.geolocation);
        this.geolocation.getCurrentPosition().then((position) => {

          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }

          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          this.performReverseGeocoding(position.coords.latitude, position.coords.longitude);
        }, (err) => {
          console.log(err);
        });
    }

    addInfoWindow(marker, content){

      let infoWindow = new google.maps.InfoWindow({
        content: content
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });

    }

    addMarker(){

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      let content = "<h4>Information!</h4>";

      this.addInfoWindow(marker, content);

    }

    performReverseGeocoding(latitude, longitude)
    {
       this.platform.ready()
       .then((data : any) =>
       {
           /*
          let latitude     : any = parseFloat(this.geoForm.controls["latitude"].value),
              longitude    : any = parseFloat(this.geoForm.controls["longitude"].value);
              */
          this._GEOCODE.reverseGeocode(latitude, longitude)
          .then((data : any) =>
          {
             this.geocoded      = true;
             this.results       = data;

          })
          .catch((error : any)=>
          {
             this.geocoded      = true;
             this.results       = error.message;
          });
       });
    }

}
