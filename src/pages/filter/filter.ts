import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import firebase from 'firebase';
import { PrestaListPage } from '../presta-list/presta-list';

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
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
    selectedTags = { "code1": 0, "code2": 0, "code3": 0, "code4": 0};
    tags = [{"name" : "code1", "duree": null, "prix": null},
            {"name" : "code2", "duree": null, "prix": null},
            {"name" : "code3", "duree": null, "prix": null},
            {"name" : "code4", "duree": null, "prix": null}];
    supplements = [];
    remote: boolean;
    home: boolean;
    prix: number;
    duree;
    category;
    supplementsNode: any;
    uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private fdb: AngularFireDatabase) {
      var obj = this;
      this.category = navParams.get('category');

      this.supplementsNode = $( "#supplement_template").clone();
      for (let i=0; i <this.tags.length; i++) {
          $( "#supplement"+i).hide();
      }

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
      for (let i=0; i <this.tags.length; i++) {
          $( "#supplement"+i).hide();
      }

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

      for (let j=0; j <this.tags.length; j++) {
          if (this.tags[j]["name"] == tagCode) {
              $( "#supplement"+j).hide();
              this.tags[j] = {"name": tagCode, "duree": null, "prix": null};

          }
      }
      console.log(this.tags);
  }

  showSupplement() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ajouter un supplement',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });

    for (let key in this.selectedTags) {
        if (this.selectedTags[key] == 0) {

            actionSheet.addButton({text: key,
                                    handler: () => {

                                      this.addSupplement(key);
                                    }})
        }
    }

    actionSheet.present();
    console.log(this.selectedTags);
  }

  addSupplement(tagCode: string) {
      //this.supplements[tagCode] = { "tagName": "", "duree": 1, "prix": null }

      for (var j=0; j <this.tags.length; j++) {
          if (this.tags[j]["name"] == tagCode) {
              $( "#supplement"+j).show();
          }

      }
      console.log(this.tags);
      /*
      var newSupplement = this.supplementsNode.clone();
      newSupplement.attr('id', "");
      newSupplement.find(".supplement_name").text(tagCode);
      $("#supplements").append(newSupplement);
      */
  }

  saveOffer() {
          // Get a key for a new Post.
    var finaltags = [];

    for (var i=0; i < this.tags.length; i++) {
        if (this.tags[i]["duree"])
            this.supplements.push(this.tags[i]);
    }

    for (var key in this.selectedTags) {
        if (this.selectedTags[key] != 0) {

            finaltags.push(key);
        }
    }

    var postData = {
        prestataire: this.uid,
        tags: finaltags,
        prix: this.prix,
        duree: this.duree,
        places: [ (this.remote) ? "remote" : null, (this.home) ? "home" : null],
        category: this.category,
        supplements: this.supplements
      };

      var newPostKey = firebase.database().ref().child('offers').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/offers/' + newPostKey] = postData;
      updates['/user-offers/' + this.uid + '/' + newPostKey] = postData;



      this.fdb.database.ref().update(updates);
      this.navCtrl.pop();
      //this.navCtrl.push(PrestaListPage);

  }


}
