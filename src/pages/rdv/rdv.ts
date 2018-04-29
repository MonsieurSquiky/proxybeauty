import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RdvHistoryPage } from '../rdv-history/rdv-history';
import { PrestaRdvPage } from '../presta-rdv/presta-rdv';

/**
 * Generated class for the RdvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rdv',
  templateUrl: 'rdv.html',
})
export class RdvPage {

    tab2Root = RdvHistoryPage;
    tab1Root = PrestaRdvPage;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad RdvPage');
    }

}
