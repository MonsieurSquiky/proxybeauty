import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
/*
  Generated class for the ReqHttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReqHttpProvider {
    /*
  constructor(public http: HttpClient) {
    console.log('Hello ReqHttpProvider Provider');
  }
  */
  token;
  refresh;
  isOAuthUsed: boolean = false;
  oauthServerUrl: string = "https://cassioauth.alwaysdata.net/token.php";
  clientId: string = 'testclient';
  clientPass: string = 'testpass';

  constructor(public http: Http) {
    //console.log('Hello Oauth2Provider Provider');
  }

  callFirebaseShop(fctName, body, loaders, context) {
      let serverUrl = 'https://us-central1-proxybeauty-2.cloudfunctions.net/'+fctName;

      let headers = new Headers({
          'X-Request-ID': (body.email ? body.email : body.uid ) + Date.now().toString(),
          'Content-Type': "application/json"
      });
      let options = new RequestOptions({ headers: headers });

      // On fait une requete pour recuperer un resultat aupre du service que l'on map en json
      this.http.post(serverUrl, body, options).map(res => res.json()).subscribe(data => {
          // ici on recupere les donnees en json
         console.log(data.message);

         for (let i=0; i < loaders.length; i++)
            loaders[i].dismiss();

         if (data.error) {
             let alert = context.alertCtrl.create({
               title: 'Erreur lors du paiement',
               subTitle: "Le paiement a échoué, vérifiez vos coordonnées bancaires ou changez de carte",
               buttons: [{
                   text: 'Ok',
                   handler: () => {
                     //obj.navCtrl.setRoot(AmbassadorPage);
                   }
                 }]
             });
             alert.present();
         }
         else {
             let alert = context.alertCtrl.create({
               title: 'Paiement effectué avec succès',
               subTitle: "Le paiement a bien été pris en compte et votre commande est enregistrée",
               buttons: [{
                   text: 'Parfait !',
                   handler: () => {
                     context.navCtrl.pop();
                     context.navCtrl.pop();
                     context.navCtrl.pop();
                   }
                 }]
             });
             alert.present();
         }


       }, error => {
             console.log(error.toString());
             for (let i=0; i < loaders.length; i++)
                loaders[i].dismiss();
                let alert = context.alertCtrl.create({
                  title: 'Erreur',
                  subTitle: error.message,
                  buttons: [{
                      text: 'OK'
                    }]
                });
                alert.present();

       });
  }

  callFirebaseConditions(fctName, body, loaders, context) {
      let serverUrl = 'https://us-central1-proxybeauty-2.cloudfunctions.net/'+fctName;
      console.log(body);
      let headers = new Headers({
          'X-Request-ID': (body.email ? body.email : body.uid ) + Date.now().toString(),
          'Content-Type': "application/json"
      });
      let options = new RequestOptions({ headers: headers });

      // On fait une requete pour recuperer un resultat aupre du service que l'on map en json
      this.http.post(serverUrl, body, options).map(res => res.json()).subscribe(data => {
          // ici on recupere les donnees en json
         console.log(data.message);

         for (let i=0; i < loaders.length; i++)
            loaders[i].dismiss();

         if (data.error) {
             let alert = context.alertCtrl.create({
               title: 'Erreur lors de la création du compte',
               subTitle: "Veuillez vérifier votre connexion et réessayer.",
               buttons: [{
                   text: 'Ok',
                   handler: () => {
                     //obj.navCtrl.setRoot(AmbassadorPage);
                   }
                 }]
             });
             alert.present();
         }
         else {
             context.goDashboard();
         }


       }, error => {
             console.log(error.toString());
             for (let i=0; i < loaders.length; i++)
                loaders[i].dismiss();
            let alert = context.alertCtrl.create({
              title: 'Erreur lors de la création du compte',
              subTitle: error.message,
              buttons: [{
                  text: 'Ok',
                  handler: () => {
                    //obj.navCtrl.setRoot(AmbassadorPage);
                  }
                }]
            });
            alert.present();

       });
  }

}
