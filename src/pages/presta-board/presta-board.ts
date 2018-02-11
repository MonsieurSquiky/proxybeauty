import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the PrestaBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage( {
    name: 'prestaboard'
})
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
      this.navCtrl.push(page);
  }
}
