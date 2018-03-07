import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ParrainageGainPage } from '../parrainage-gain/parrainage-gain';
import { PrestaListPage } from '../presta-list/presta-list';
import { PrestaRatingsPage } from '../presta-ratings/presta-ratings';
import { PrestaRdvPage } from '../presta-rdv/presta-rdv';
import { SchedulePage } from '../schedule/schedule';
/**
 * Generated class for the PrestaBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-presta-board',
  templateUrl: 'presta-board.html',
})
export class PrestaBoardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
      this.menu.enable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrestaBoardPage');
  }

  goToPage(page: string) {
      switch (page) {
          case 'prestalist':
            this.navCtrl.push(PrestaListPage);
          break;

          case 'schedule':
            this.navCtrl.push(SchedulePage);
          break;

          case 'prestardv':
            this.navCtrl.push(PrestaRdvPage);
          break;

          case 'gains':
            this.navCtrl.push(ParrainageGainPage);
          break;

          case 'prestaratings':
            this.navCtrl.push(PrestaRatingsPage);
          break;
      }
      //this.navCtrl.push(page);
  }
}
