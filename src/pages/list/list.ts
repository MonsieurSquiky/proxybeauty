import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Array<{title: string, note: number, price: number, statut: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icons = ['Professionnel', 'Particulier', 'Salon', 'Diplome'];

    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Annonceur ' + i,
        note: Math.floor(Math.random() * 5),
        price: Math.floor(Math.random() * 60),
        statut: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
