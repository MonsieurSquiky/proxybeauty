import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { DashboardPage } from '../dashboard/dashboard';
import { PrestaBoardPage } from '../presta-board/presta-board';
/**
 * Generated class for the HomepagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html',
})
export class HomepagePage {
    uid;
    constructor(private fdb: AngularFireDatabase, public navCtrl: NavController) {

        var obj =this;
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // User is signed in.
                obj.uid = user.uid;
                obj.goDashboard();
              } else {
                // No user is signed in.
                console.log("No user signed");
              }
            });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomepagePage');
  }

  goDashboard () {
      var ref = this.fdb.database.ref("/users/"+ this.uid);
      var obj = this;
      ref.on("value", function(snapshot) {
          console.log(snapshot.val().statut);
          if (snapshot.val().statut == "client")
            obj.navCtrl.setRoot(DashboardPage);
          else
            obj.navCtrl.setRoot(PrestaBoardPage);
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });

  }

}
