import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { SchedulePage } from '../schedule/schedule';
import { PrestaRdvPage } from '../presta-rdv/presta-rdv';

/**
 * Generated class for the HorairePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage({
     name: 'horaire'
 })
@Component({
  selector: 'page-horaire',
  templateUrl: 'horaire.html',
})
export class HorairePage {

    tab1Root = SchedulePage;
    tab2Root = PrestaRdvPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HorairePage');
  }

}
