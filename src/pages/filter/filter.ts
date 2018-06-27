import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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


@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
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
            		"Lumière pulsée"],
            "Visage" : ["Extension de cils",
            	    "Permanente de cils",
            	    "Rehaussement de cils",
            	    "Teinture des cils et des sourcils",
            	    "Soin du visage micro-aiguilles",
            	    "Soin du visage anti-acné",
            	    "Épilation des sourcils au fil",
            	    "Épilation des sourcils à la cire",
            	    "Maquillage",
            	    "Soin acupuncture rajeunissement",
            	    "Soin du visage homme",
            	    "Lifting visage non chirurgical",
            	    "Peeling du visage",
            	    "Thérapie lumineuse LED",
            	    "Soin du visage peaux jeunes",
            	    "Maquillage permanent et semi-permanent",
            	    "Microblading",
            	    "Soin des cils et sourcils",
            	    "Microdermabrasion",
            	    "Soin du visage femme",
            	    "Soin du visage à l'oxygène",
            	    "Consultation de la peau"]
            };

    selectedTags = {};
    tags = [];
    offerId;
    supplements = [];
    remote: boolean;
    home: boolean;
    prix: number;
    duree: number;
    category;
    supplementsNode: any;
    uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  public actionSheetCtrl: ActionSheetController, private fdb: AngularFireDatabase) {
      var obj = this;
      this.category = navParams.get('category');

      for(let i=0; i < this.metatags[this.category].length; i++) {
          this.selectedTags[this.metatags[this.category][i]] = 0
          this.tags.push( {"name": this.metatags[this.category][i], "duree": null, "prix": null});
      }

      this.supplementsNode = $( "#supplement_template").clone();

  }

  ionViewDidLoad() {
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

      this.offerId = this.navParams.get('offerId');
      var obj = this;
      if (this.offerId) {
          var offersRef = this.fdb.database.ref('/offers/' + this.offerId);
          offersRef.on('value', function(snapshot) {
              let offer = snapshot.val();
              if (offer.tags) {
                  for (let tag of offer.tags)
                      obj.switchTag(tag);
              }
              obj.home = (snapshot.val().places.indexOf('home') != -1) ? true : false;
              obj.remote = (snapshot.val().places.indexOf('remote') != -1) ? true : false;

              obj.prix = offer.prix;
              obj.duree = offer.duree;
              if (offer.supplements && obj.tags) {
                  for (let tag of offer.supplements) {
                      for (var j=0; j < obj.tags.length; j++) {

                          if (obj.tags[j]["name"] == tag.name) {
                              $( "#supplement"+j).show();
                              obj.tags[j].prix = tag.prix;
                              obj.tags[j].duree = tag.duree;
                          }

                      }
                  }
              }
          });
      }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  switchTag(tagCode: string) {
      if  (this.selectedTags[tagCode] == 0) {
          this.addSupplement(tagCode);
          this.selectedTags[tagCode] = 1;
      }
      else {
          for (let j=0; j <this.tags.length; j++) {
              if (this.tags[j]["name"] == tagCode) {
                  $( "#supplement"+j).hide();
                  this.tags[j] = {"name": tagCode, "duree": null, "prix": null};

              }
          }
          this.selectedTags[tagCode] = 0;
      }

      var tagButton = document.getElementById(tagCode);
      if (tagButton.className.search("main-color-button") == -1 ) {
          tagButton.className += " main-color-button";
      }
      else {
          tagButton.className = tagButton.className.replace("main-color-button", "");
      }
      /* Old system for erasing supplemnt if tag is selected
      for (let j=0; j <this.tags.length; j++) {
          if (this.tags[j]["name"] == tagCode) {
              $( "#supplement"+j).hide();
              this.tags[j] = {"name": tagCode, "duree": null, "prix": null};

          }
      }
      */
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
        if (this.tags[i]["prix"] && this.supplements.indexOf(this.tags[i]) == -1)
            this.supplements.push(this.tags[i]);
    }
    /*
    for (var key in this.selectedTags) {
        if (this.selectedTags[key] != 0) {

            finaltags.push(key);
        }
    }
    */
    if (this.invariant()) {
        var postData = {
            prestataire: this.uid,
            tags: finaltags,
            prix: this.prix,
            duree: this.duree,
            places: [ (this.remote) ? "remote" : null, (this.home) ? "home" : null],
            category: this.category,
            supplements: this.supplements
          };

          var newPostKey = (this.offerId) ? this.offerId : firebase.database().ref().child('offers').push().key;

          // Write the new post's data simultaneously in the posts list and the user's post list.
          var updates = {};
          updates['/offers/' + newPostKey] = postData;
          updates['/user-offers/' + this.uid + '/' + newPostKey] = postData;



          this.fdb.database.ref().update(updates);
          this.navCtrl.pop();
          this.navCtrl.pop();
          this.navCtrl.push(PrestaListPage);
      }
  }

  invariant() {
      if (!(this.home || this.remote )) {
          let alert = this.alertCtrl.create({
            title: "Sélectionnez au moins un mode",
            subTitle: "Vous devez indiquer si vous effectuerez les prestations sur votre lieu de travail ou à domicile chez vos clients; ou les deux.",
            buttons: ['OK']
          });
          alert.present();
          return false;
      }

      if (!this.prix || this.prix < 5) {
          let alert = this.alertCtrl.create({
            title: "Prix invalide",
            subTitle: "Veuillez entrer un prix non nul supérieur à 5€.",
            buttons: ['OK']
          });
          alert.present();
          return false;
      }

      if (!this.duree) {
          let alert = this.alertCtrl.create({
            title: "Durée de la prestation non indiquée",
            subTitle: "Veuillez entrer la durée estimée de votre prestation.",
            buttons: ['OK']
          });
          alert.present();
          return false;
      }

      for (var i=0; i < this.supplements.length; i++) {
          if (!this.supplements[i].prix) {
              let alert = this.alertCtrl.create({
                title: this.supplements[i].name + " : prix invalide",
                subTitle: "Veuillez entrer un prix non nul pour le tag "+ this.supplements[i].name,
                buttons: ['OK']
              });
              alert.present();
              return false;
          }

          if (!this.supplements[i].duree) {
              let alert = this.alertCtrl.create({
                title: this.supplements[i].name + " : durée invalide",
                subTitle: "Veuillez entrer la durée estimée pour le tag "+ this.supplements[i].name,
                buttons: ['OK']
              });
              alert.present();
              return false;
          }
      }

      return true;
  }


}
