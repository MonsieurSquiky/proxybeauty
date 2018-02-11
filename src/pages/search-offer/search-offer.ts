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

@IonicPage()
@Component({
    selector: 'page-search-offer',
    templateUrl: 'search-offer.html',
})
export class SearchOfferPage {
    selectedTags = { "code1": 0, "code2": 0, "code3": 0, "code4": 0};
    remote: boolean;
    home: boolean;
    category;
    uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private fdb: AngularFireDatabase) {
      var obj = this;
      this.category = navParams.get('category');
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
  }

  ionViewDidLoad() {

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
