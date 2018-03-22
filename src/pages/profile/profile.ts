import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { FirstloginPage } from '../firstlogin/firstlogin';
import { ProfilepicPage } from '../profilepic/profilepic';
import { SetAddressPage } from '../set-address/set-address';

import firebase from 'firebase';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

    uid: string;
    data = {};
    constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductPage');
        const obj = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
              console.log(user.uid);
              var ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', function(snapshot) {
                  obj.data = (snapshot.val()) ? snapshot.val() : false;
                });


              //navCtrl.setRoot(PrestaBoardPage);
            } else {
              // No user is signed in.
              console.log("No user signed");
              obj.navCtrl.setRoot(HelloIonicPage);
            }
          });

    }

    update(page: string) {
        console.log('Modifying Profile');
        switch (page) {
            case 'profilepic':
              this.navCtrl.push(ProfilepicPage, { update: true, profilepic: this.data['profilepic'] ? this.data['profilepic'].url : false});
            break;

            case 'address':
              this.navCtrl.push(SetAddressPage, { update: true, place: this.data['address'] ? this.data['address'].place : null });
            break;

            case 'name':
              this.navCtrl.push(FirstloginPage, { update: true,
                                                  firstname: this.data['firstname'],
                                                  lastname: this.data['lastname'],
                                                  birthdate: this.data['birthdate'],
                                                  name: this.data['salonName'] ? this.data['salonName'] : null});
            break;


        }
        //this.navCtrl.push(page);
    }

}
