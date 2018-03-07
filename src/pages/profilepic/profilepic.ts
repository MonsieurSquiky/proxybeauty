import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { PrestaBoardPage } from '../presta-board/presta-board';
import { DashboardPage } from '../dashboard/dashboard';
import { Camera } from '@ionic-native/camera';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { AngularFireDatabase } from 'angularfire2/database';
import { SetParrainPage } from '../set-parrain/set-parrain';

/**
 * Generated class for the ProfilepicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profilepic',
  templateUrl: 'profilepic.html',
})
export class ProfilepicPage {
  imageSrc = "./assets/img/profilePic.png";
  uid;

  constructor(  public loadingCtrl: LoadingController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public cameraPlugin: Camera,
                public alertCtrl: AlertController,
                private fdb: AngularFireDatabase) {

        var obj =this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              obj.uid = user.uid;
              console.log(user.uid);
            } else {
              // No user is signed in.
              console.log("No user signed");
              navCtrl.setRoot(HelloIonicPage);
            }
          });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilepicPage');
  }

  private openGallery(): void {
    let cameraOptions = {
      sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.cameraPlugin.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 600,
      targetHeight: 600,
      encodingType: this.cameraPlugin.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit : true
    }

    this.cameraPlugin.getPicture(cameraOptions)
      .then(profilePicture => this.savePicture(profilePicture),
      err => console.log(err));
  }

  takeSelfie(): void {
      var obj =this;
      this.cameraPlugin.getPicture({
        quality : 50,
        destinationType : this.cameraPlugin.DestinationType.DATA_URL,
        sourceType : this.cameraPlugin.PictureSourceType.CAMERA,
        allowEdit : true,
        encodingType: this.cameraPlugin.EncodingType.JPEG,
        targetWidth: 600,
        targetHeight: 600,
        saveToPhotoAlbum: true
      }).then(profilePicture => {
          this.savePicture(profilePicture);

      }, error => {
        // Log an error to the console if something goes wrong.
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }
    savePicture(pic): void {
        // Send the picture to Firebase Storage
        var ob = this;
        const selfieRef = firebase.storage().ref('profilePictures/'+this.uid+'/profilePicture.png');

        let loading = this.loadingCtrl.create({
        content: 'Recherche en cours...'
        });

        loading.present();

          selfieRef
            .putString(pic, 'base64', {contentType: 'image/jpeg'})
            .then(savedProfilePicture => {
                ob.imageSrc = savedProfilePicture.downloadURL;

                var updates = {};
                updates['/users-profilepics/'+this.uid] = {url: savedProfilePicture.downloadURL};
                updates['/users/' + this.uid + '/profilepic'] = {url: savedProfilePicture.downloadURL};
                updates['/users/' + this.uid + '/setupStep'] = 4;

                ob.fdb.database.ref().update(updates);

                loading.dismiss();

            }, error => {
                let alertVerification = ob.alertCtrl.create({
                  title: "Erreur lors du téléchargement de l'image",
                  subTitle: "Une erreur est survenue, veuillez vérifier votre connexion internet et réessayer ultérieurement.",
                  buttons: ['OK']
                });
                alertVerification.present();

              // Log an error to the console if something goes wrong.
              console.log("ERROR -> " + JSON.stringify(error));
            });
    }

    goNext() {
        this.navCtrl.push(SetParrainPage);
    }
}
