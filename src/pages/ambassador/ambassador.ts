import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

import { AmbassadorInfosPage } from '../ambassador-infos/ambassador-infos';
import { ParrainageGainPage } from '../parrainage-gain/parrainage-gain';

/**
 * Generated class for the AmbassadorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//@ViewChild('myTabs') tabRef: Tabs;
@IonicPage()
@Component({
  selector: 'page-ambassador',
  templateUrl: 'ambassador.html',
})
export class AmbassadorPage {

    tab1Root = AmbassadorInfosPage;
    tab2Root = ParrainageGainPage;

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ParrainagePage');
    }
}
