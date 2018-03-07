import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import firebase from 'firebase';
import { ResultOfferPage } from '../result-offer/result-offer';

import { AngularFireDatabase } from 'angularfire2/database';
import * as $ from 'jquery'

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
    selector: 'page-search-offer',
    templateUrl: 'search-offer.html',
})
export class SearchOfferPage {
    metatags = { "Coiffure" : ["Coupe Femme",
            		"Coloration",
            		"Balayage",
            		"Mèches",
            		"Tie & Dye",
            		"Ombré Hair",
            		"Lissage",
            		"Brushing",
            		"Permanente",
            		"Défrisage",
            		"Tissage",
            		"Afro",
            		"Beauté",
            		"Esthétique",
            		"Minceur",
            		"Soin du cheveu"],
              "Ongles" : [  "Manucure",
            		"Pédicure",
            		"Vernis semi-permanent",
            		"Ongles en gel",
            		"Nail art",
            		"Réparation ongle cassé",
            		"Extension/Faux ongles",
            		"Remplissage d'ongles",
            		"Traitement paraffine"],
              "Massage" : [	"4 ou 6 mains",
            		"Aux pierres chaudes",
            		"Acupression",
            		"Pré/Post natal",
            		"Amincissant",
            		"Mains",
            		"Pieds",
            		"Pierre de lave",
            		"Indien (de la tête)",
            		"Aux compresses d'herbes",
            		"Thérapeutique",
            		"Sportif",
            		"Visage",
            		"Suédois",
            		"Ayurvédique",
            		"En couple",
            		"Thailandais",
            		"Réflexologie",
            		"Chinois",
            		"Aux huiles essentielles",
            		"Dos, épaules et cou",
            		"Deep tissue",
            		"Californien",
            		"Shiatsu"],
             "Epilation" : ["Maillot",
            		"Maillot intégral",
            		"Maillot brésilien",
            		"Jambes",
            		"Aisselles et bras",
            		"Visage",
            		"Visage (au fil)",
            		"A la cire",
            		"Orientale",
            		"Lumière pulsée"]
            };
    selectedTags = {};
    remote: boolean;
    home: boolean;
    category;
    uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private fdb: AngularFireDatabase) {
      this.category = navParams.get('category');

      for(let i=0; i < this.metatags[this.category].length; i++) {
          this.selectedTags[this.metatags[this.category][i]] = 0;
      }
  }

  ionViewDidLoad() {
      var obj = this;
      this.category = this.navParams.get('category');
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;
            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });
      this.remote = true;
      this.home = true;
      console.log('SearchPage Loaded');
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  switchTag(tagCode: string) {
      this.selectedTags[tagCode] = (this.selectedTags[tagCode] == 0) ? 1 : 0;
      var tagButton = document.getElementById(tagCode);
      if (tagButton.className.search("main-color-button") == -1 ) {
          tagButton.className += " main-color-button";
      }
      else {
          tagButton.className = tagButton.className.replace("main-color-button", "");
      }

  }


  startSearch() {
          // Get a key for a new Post.
    var finaltags = [];

    for (var key in this.selectedTags) {
        if (this.selectedTags[key] != 0) {

            finaltags.push(key);
        }
    }

      this.navCtrl.push(ResultOfferPage, { category: this.category, tags: finaltags, remote: this.remote, home: this.home});

  }


}
