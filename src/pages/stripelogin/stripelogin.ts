import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { HTTP } from '@ionic-native/http';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

/**
 * Generated class for the StripeloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stripelogin',
  templateUrl: 'stripelogin.html',
})
export class StripeloginPage {

  url: string;
  uid;
  constructor(private fdb: AngularFireDatabase, private http: HTTP, public navCtrl: NavController, public navParams: NavParams, private inAppBrowser: InAppBrowser) {
      this.url = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_CJq7755NhajRhvInkMLWu9LX3VztoPc4&scope=read_write';
      var obj = this;
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            obj.uid = user.uid;

            //navCtrl.setRoot(PrestaBoardPage);
          } else {
            // No user is signed in.
            console.log("No user signed");
          }
        });
   }

  openWebpage(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }

    this.url = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_CJq7755NhajRhvInkMLWu9LX3VztoPc4&scope=read_write';
    // Opening a URL and returning an InAppBrowserObject
    const obj =this;
    const browser = this.inAppBrowser.create(url, '_self', options);
    browser.on('loadstart').subscribe((event) => {
        console.log(" ICI LA VERITE !!!!!!!! " + event.url);
        if (event.url.search('proxybeauty') != -1 ) {
            var redirect_url = new URL(event.url);
            var code = redirect_url.searchParams.get("code");
            if (code) {
                console.log(code);
                obj.http.post('https://connect.stripe.com/oauth/token',
                                {client_secret: 'sk_test_YbCOAC3bgr7DbbFUNsmv1fx5', code: code, grant_type:'authorization_code'},
                                 {'Content-Type': 'application/json'})
                  .then(data => {

                    console.log(data.status);
                    console.log(data.data); // data received by server
                    //if (data.data.access_token)
                        obj.fdb.database.ref(`/stripe_sellers/${this.uid}/token`).set(JSON.parse(data.data));
                    console.log(data.headers);

                    browser.close();

                  })
                  .catch(error => {

                    console.log(error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);

                  });
            }
            var error = redirect_url.searchParams.get("error");
        }


        console.log(error);
    });
   // Inject scripts, css and more with browser.X
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad StripeloginPage');
  }

}
