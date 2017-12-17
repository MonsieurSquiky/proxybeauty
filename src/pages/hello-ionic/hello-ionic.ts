import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor(public navCtrl: NavController, private http: Http) {

  }

  openList() {
    this.navCtrl.setRoot(DashboardPage);
    let headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic dGVzdGNsaWVudDp0ZXN0cGFzcw==');
        this.http.post('http://localhost/oauth2-server/token.php', 'grant_type=client_credentials', {headers : headers})
      .subscribe(data => {

        console.log(data);
      });
  }
}
