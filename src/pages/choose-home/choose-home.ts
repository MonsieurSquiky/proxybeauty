import {Component} from '@angular/core';
import {AutocompletePage} from '../autocomplete/autocomplete';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the ChooseHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-home',
  templateUrl: 'choose-home.html',
})
export class ChooseHomePage {

    address;

    constructor(
      private navCtrl: NavController,
      private modalCtrl:ModalController
    ) {
      this.address = {
        place: ''
      };
    }

    showAddressModal () {
      let modal = this.modalCtrl.create(AutocompletePage);
      let me = this;
      modal.onDidDismiss(data => {
        this.address.place = data;
      });
      modal.present();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseHomePage');
  }

}
