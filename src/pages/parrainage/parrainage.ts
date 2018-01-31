import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ParrainageGainPage } from '../parrainage-gain/parrainage-gain';
import { PrestaRatingsPage } from '../presta-ratings/presta-ratings';
/**
 * Generated class for the ParrainagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage({
    name: 'parrainage'
})
@Component({
  selector: 'page-parrainage',
  templateUrl: 'parrainage.html',
})
export class ParrainagePage {

    tab1Root = ParrainageGainPage;
    tab2Root = PrestaRatingsPage;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad ParrainagePage');
    }

}
