import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import firebase from 'firebase';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {
    public currentToken;
    constructor(
      public firebaseNative: Firebase,
      public fdb: AngularFireDatabase,
      private platform: Platform) {

    }

    async getToken(userId) {
        let token;

        if (this.platform.is('android')) {
            token = await this.firebaseNative.getToken();
        }

        if (this.platform.is('ios')) {
            token = await this.firebaseNative.getToken();
            await this.firebaseNative.grantPermission();
        }
        this.currentToken = token;
        return this.saveTokenToFirebase(token, userId);
    }

    private saveTokenToFirebase(token, userId) {
        if (!token) return;


          // User is signed in.
            var ref = firebase.database().ref('devices/' + userId);

            return ref.once('value', function(snapshot) {
                let tokenList = [token];
                if (snapshot.exists()) {
                    if (snapshot.hasChild('tokenList')) {
                        tokenList = snapshot.child('tokenList').val().length >= 1 ? snapshot.child('tokenList').val() : tokenList ;
                        if (tokenList.indexOf(token) == -1)
                            tokenList.push(token);
                    }
                }
                return ref.child('tokenList').set(tokenList);
            });
    }

    listenToNotifications() {
      return this.firebaseNative.onNotificationOpen()
    }

}
