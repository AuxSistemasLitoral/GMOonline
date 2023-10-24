import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
//import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public router:Router,
    private platform: Platform,
    // private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.platform.backButton.subscribeWithPriority(10, () => {

    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
     // this.statusBar.styleDefault();
      this.router.navigateByUrl('splash');
    });
  }
}
