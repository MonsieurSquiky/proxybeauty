import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrestaBoardPage } from '../presta-board/presta-board';

/**
 * Generated class for the PrestaRdvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
    name: 'prestardv'
})
@Component({
  selector: 'page-presta-rdv',
  templateUrl: 'presta-rdv.html',
})
export class PrestaRdvPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrestaRdvPage');
  }

  goBoard() {
      this.navCtrl.setRoot(PrestaBoardPage);
  }

}
