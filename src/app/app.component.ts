import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { ObservableProvider } from '../providers/observable/observable';
import { HomePage } from '../pages/home/home';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements AfterViewInit {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private observableProvider: ObservableProvider,
    public menu: MenuController, private push: Push) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Logout', component: LoginPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      setTimeout(() => {
        this.pushSetup();
      }, 1000);

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if ( (page.title).toLowerCase()  == 'logout') {
      this.observableProvider.stitchLogout();
      localStorage.clear();
    }
    this.nav.setRoot(page.component);
  }

  ngAfterViewInit() {
    this.observableProvider.initStitch();
  }

  pushSetup() {
    const options: PushOptions = {
      android: {
        senderID: '944375263748'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      localStorage.setItem('token', registration.registrationId);
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

}

